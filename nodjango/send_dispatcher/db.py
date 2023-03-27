import sqlalchemy as sa
from datetime import date, datetime, timedelta

def excludingDate():
    return date(2001,9,11)

def window(days_):
    return date.today()-timedelta(days=days_)

class Session:

    def __init__(self, db_url) -> None:
        self.__engine = sa.create_engine(db_url)
        self.__metadata = sa.MetaData()
        self.__metadata.reflect(bind=self.__engine)
        self.__lead_table = self.__metadata.tables['crm_lead']
        self.__export_table = self.__metadata.tables['crm_export']
        self.__dialer_table = self.__metadata.tables['crm_dialer']
        self.__log_table = self.__metadata.tables['crm_log']
        self.__category_table = self.__metadata.tables['crm_category']
        self.__export_log_table = self.__metadata.tables['crm_exportlog']
        self.__conn = self.__engine.connect().__enter__()
        

    def __del__(self):
        self.__conn.__exit__(None,None,None)
        del self.__engine

    def count_lead_for_export(self):
        s = sa.sql.select([sa.sql.func.count()]).select_from(self.__lead_table).where(self.__lead_table.c.last_send==excludingDate())        
        return self.__conn.execute(s).scalar()

    def update_date(self, exportlogid, lead_id):
        u = sa.sql.update(self.__lead_table).values(last_export_id=exportlogid).where(self.__lead_table.c.id==lead_id)
        self.__conn.execute(u)

    def get_leads_for_export_from_ids(self, ids):
        
        s = sa.sql.select([self.__lead_table.c.id, self.__lead_table.c.name, self.__lead_table.c.phone, self.__lead_table.c.geo], self.__lead_table.c.id.in_(ids))
        return self.__conn.execute(s).fetchall()
    
    def get_leads_for_export_from_count(self, count, category, silent):
        sc = sa.sql.select(self.__category_table.c.id).where(self.__category_table.c.id==category)
        category = self.__conn.execute(sc).scalar_one_or_none()
        s = sa.sql.select([self.__lead_table.c.id, self.__lead_table.c.name, self.__lead_table.c.phone, self.__lead_table.c.geo]) \
            .select_from(self.__lead_table )\
            .join(self.__export_log_table, self.__lead_table.c.last_export_id==self.__export_log_table.c.id, isouter = True) \
            .where(sa.or_( self.__export_log_table.c.at < window(silent), self.__export_log_table.c.at==None) ) \
            .order_by(sa.nullsfirst(self.__export_log_table.c.at.asc())) \
            .limit(count)
        return self.__conn.execute(s)
    
    def get_dialer_call_from_id(self, id):
        s = sa.sql.select(self.__dialer_table.c.dialer_id).where(self.__dialer_table.c.id==id)
        return self.__conn.execute(s).scalar()
    
    def get_dialer_call_from_name(self, name):
        s = sa.sql.select(self.__dialer_table.c.dialer_id).where(self.__dialer_table.c.name==name)
        return self.__conn.execute(s).scalar()

    def get_export(self):
        s = sa.sql.select(self.__export_table).where(self.__export_table.c.exported==None)
        return self.__conn.execute(s).first() 

    def set_export_status(self, id, state):
        u = sa.sql.update(self.__export_table).where(self.__export_table.c.id==id).values(exported=datetime.now())
        return self.__conn.execute(u)

    def create_log(self, text):
        i = sa.sql.insert(self.__log_table).values(text=text, at=datetime.now())
        return self.__conn.execute(i)

    def add_exportlog(self, leadid, exportid):
        i = sa.sql.insert(self.__export_log_table).values(lead_id=leadid,export_id=exportid, at=datetime.now())
        #ex = self.__conn.execute(i)
        return self.__conn.execute(i).inserted_primary_key[0]
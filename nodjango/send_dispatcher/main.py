from .db import Session as mdSess
from time import sleep
from .exporter import export as hadnle_export
import argparse

def extract_db_url(path,name):
    result = dict()
    with open(path, 'r') as file:
        for line in file:
            result[line.split('=')[0]] = "".join(line.split('=')[1:]).removesuffix('\n')
    return result[name]
    pass

def test(path):
    a = extract_db_url(path, 'CC1_DB_URL')
    for db in (extract_db_url(path, 'CC1_DB_URL'),extract_db_url(path, 'CC2_DB_URL')):

        sess = mdSess(a)
        export = dict(sess.get_export() or {})
        was_send = []
        print(sess.create_log(f"Експорт #1: експортовано 1 лідів.\n1"))
        if export:
            for id, stat in zip(*hadnle_export(sess, export)):
                if stat:
                    was_send.append(id)
                    sess.update_date(sess.add_exportlog(id, export['id']),id)
            sess.set_export_status(export['id'], True)
            print(sess.create_log(f"Експорт #{str(export['id'])}: експортовано {len(was_send)} лідів.\n{str(was_send)}"))
        print(sess.get_dialer_call_from_id(1))
    

def main(path):
    
    while(True):
        for db in (extract_db_url(path, 'CC1_DB_URL'),extract_db_url(path, 'CC2_DB_URL')):
            sess = mdSess(db)
            export = sess.get_export()
            if export:
                was_send = []
                for id, stat in zip(*hadnle_export(sess, export)):
                    if stat:
                        #sess.add_exportlog(id, export.id)
                        sess.update_date(sess.add_exportlog(id, export['id']), id)
                sess.set_export_status(export.id, True)
                sess.create_log(f"Експорт #{str(export.id)}: обработан.")
        print("checked")
        sleep(5*60) #five minut delay after export



if __name__=='__main__':
    args = argparse.ArgumentParser(description="Exporter for oki-toki")
    args.add_argument('configfile', type=str, help="path to file with configuration")
    path = args.parse_args().configfile
    #test(path)
    main(path)
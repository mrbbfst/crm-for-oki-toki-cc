import json
#from models import Lead as LeadModel
#from ..crm.models import Lead as LeadModel

#from ..crm.models import Product as CategoryModel
from .models import Lead as LeadModel
from .models import Category as CategoryModel
from .models import Log as LogModel

"""
def checkPnoneNumbers(phones):
    for k in phones.keys():
        if(LeadModel.objects.get(phone=k).count() == 0):
            phones[k] = True 
    return phones
"""
'''
def getCategoriesContext():
    obj = list(CategoryModel.objects.all())
    return obj
'''

'''
def checkProducts(products):
    for k in products:
        try:
            obj = CategoryModel.objects.get(name=k)
        except CategoryModel.DoesNotExist:
            obj =CategoryModel(name=k)
            obj.save()
'''
def make_LeadModelList(leads):
    result = []
    cat = CategoryModel.objects.get(name=leads['categories'])
    leads = leads['leads']
    for lead in leads:
        geo_ = lead.get('geo')
        result.append(LeadModel(name=lead['name'], \
         phone=lead['phone'], product=cat, geo=geo_))
    return result
        
    
def upLeadBulk(leads):
    LeadModel.objects.bulk_create(leads, ignore_conflicts=True)

def addLeads(leads_raw):
    leads = json.loads(leads_raw)

    cstart = LeadModel.objects.all().count()
    upLeadBulk(make_LeadModelList(leads))
    cend = LeadModel.objects.all().count()
    LogModel.new("В базу добавлено " + str(cend-cstart) + " лидов.")
    return cend-cstart
        
def updLead(leads, category):
    upd_list = []
    for phone_ in leads:
        try:
            lead = LeadModel.objects.get(phone=phone_)
            lead.product = category
            upd_list.append(lead)
        except LeadModel.DoesNotExist:
            continue

    a = LeadModel.objects.bulk_update(upd_list, ['product'])
    return a


def updateLeads(leads_raw):
    leads = json.loads(leads_raw)
    cat = CategoryModel.objects.get(name=leads['categories'])
    leads_leads = []
    for item in leads['leads']:
        leads_leads.append(item['phone'])
    leads['leads']=leads_leads
    unique = len(set(leads['leads']))
    if(len(leads['leads']) == 0):
        return {'error' : 'cant decoded'}

    ret_count = 0
    
    ret_count += updLead(leads['leads'] ,cat)
    LogModel.new(str(ret_count) + " Лидов переведено в категорию " + cat.name)
    return ret_count

from glob import glob
from multiprocessing import Lock
from multiprocessing.connection import wait
import threading
import json
from typing import Iterable, Iterator
from .models import Lead as LeadModel
from .models import Category as CategoryModel
from .models import Log as LogModel
from .windowsilence import getSilentWindow as window
from . windowsilence import excludingDate
from time import sleep 
from django.db.models import Q
from django.db.models import F 
from datetime import date, datetime

from urllib import parse

#from .api_func import api_send

import environ

env = environ.Env()
environ.Env.read_env()

lock_notes = threading.Lock()
lock_queue = threading.Lock()

import requests

from concurrent.futures import ThreadPoolExecutor, thread
import json

from time import sleep

notes = []

queue_leads = []

def get_count():
    global queue_leads
    return len(queue_leads)


def delete_from_queue(lead):
    global queue_leads
    global lock_queue
    with lock_queue:
        queue_leads.remove(lead)

def fill_queue(send_list):
    global queue_leads
    global lock_queue
    count = 0
    first = ""
    last = ""
    with lock_queue:
        for item in send_list:
            if count==0:
                first = item['phone']
            if count==len(send_list)-1:
                last = item['phone']
            if not item in queue_leads:
                queue_leads.append(item)
                count += 1
    LogModel.new("В очередь на отправку добавлено " + str(count) + " лидов первый " + str(LeadModel.objects.get(phone=first).id) + " послединй " + str(LeadModel.objects.get(phone=last).id))

def get_note():
    global notes
    result = ''
    global lock_notes
    with lock_notes:
        while len(notes):
            result += '\n' + notes.pop()
    return result

def add_note(text):
    global notes
    global lock_notes
    with lock_notes:
        notes.append(text)
    return 1


def set_now_date(phone_):
    lead = LeadModel.objects.get(phone=phone_)
    lead.last_send = datetime.now()
    lead.save()

api_urls = {'add-update' : 'https://noname.oki-toki.net/api/v1/contacts/add-update',
            'add-task' : 'https://noname.oki-toki.net/api/v1/dialers/create_task',
            'add-tasks' : 'https://noname.oki-toki.net/api/v1/imports/tasks/add',
            'test' : 'http://127.0.0.1:8000/crm/test/',
            'monster-add' : 'http://api.monsterleads.pro/method/{method}'
            #?api_key={key}&format=json&code={code}&tel={tel}&name={name}&ip={ip}',
            #http://api.monsterleads.pro/method/order.add
            # ?api_key=
            # &format=json
            # &code=
            # &tel=
            # &name=
            # &ip=
            }

api_token = env('API_TOKEN') 

def make_body(lead):
    global api_token
    
    result = {'api_key': api_token, \
        'tel' : lead['phone'],
        'name' : lead['Name'],
        #'code' : code,
        'code': lead['dialer_id'],
        'format' : 'json',
        'ip' : '127.0.0.1'
    }
    return result

def req(data):
    global api_urls
    body = make_body(data)
    header = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    }
    
    return requests.get(url=api_urls['monster-add'].format(method="order.add"), 
                        params=body, headers=header) #заменить на нормальный ключ!!! 


def api_send(leads):
    result = list()
    #with ThreadPoolExecutor(max_workers=5) as executor:
    #    result = executor.map(req,leads)
    #    executor.shutdown(wait=False)
    for data in leads:
        result.append(req(data))
    return result

def make_stat(r:Iterator):
    was_send = 0
    wasnt_send = 0
    dialer_id = 0
    for elem in r:
        body_={}
        try:
            body_ = parse.urlsplit(elem.url)
            body_ = parse.parse_qs(parse.urlsplit(elem.url).query)
        except TypeError as e:
            print(e)
            wasnt_send+=1
            continue
        lead_ = {'Name' : body_['name'][0], 
            'phone': body_['tel'][0], 
            'dialer_id': body_['code'][0]}
        delete_from_queue(lead_)
        if(elem.status_code==200 and json.loads(elem.content)["status"]== 'ok'):
            set_now_date(lead_['phone'])
            was_send+=1
        else:
            wasnt_send+=1
        dialer_id = body_['code'][0]
        #wasnt_send += '\n' + 'Status code: ' + str(elem.status_code) + '\n' + elem.content.decode('utf-8')
    LogModel.new("Отправленно " + str(was_send) + " лидов на номер автообзвона " + str(dialer_id))
    return was_send, wasnt_send

"""
def add_leads(leads):
    global queue_leads
    for lead in leads:
        if(not lead in queue_leads):
            queue_leads.append(lead) 
"""
def make_list(leads_db, dialer_id ):
    result = []
    for lead in leads_db:
        item = {'Name' : lead.name,
                'phone' : lead.phone,
                'dialer_id' : dialer_id}
        result.append(item)

    return result


    
def make_update_list(gen_resp):
    result = []
    for item in gen_resp:
        if(item['status'] == 200):
            l = LeadModel.objects.get(phone=item['phone'])
            l.last_send= date.today()
            result.append(l)
    return result


def send(send_data):
    global queue_leads

    data = json.loads(send_data) # example {'category':"hot", 'count':253, 'dialer_id': 12} 
    data['count'] = int(data['count'])
    silent_=data['silent']
    leads_db = LeadModel.objects.filter(product=CategoryModel.objects.get(name=data['category'])) \
        .filter(Q(last_send__lte=window(silent_)) | Q(last_send=None)) \
        .exclude(last_send=excludingDate()).order_by(F('last_send').asc(nulls_first=True) ) [:data['count']]   #    order_by(  )
    send_list = make_list(leads_db, data['dialer_id'])
    
    fill_queue(send_list)

    upd_leads = []
    temp = queue_leads
    
    r = api_send(temp)  

    was_send, wasnt_send = make_stat(r)
    if wasnt_send > 0:
        add_note("<b>Не</b> были отправленны " + str(wasnt_send))
            
    return was_send


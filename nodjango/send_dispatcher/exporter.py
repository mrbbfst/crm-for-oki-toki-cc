from .db import Session
import grequests
import json
api_urls = {'add-update' : 'https://noname.oki-toki.net/api/v1/contacts/add-update',
            'add-task' : 'https://noname.oki-toki.net/api/v1/dialers/create_task',
            'add-tasks' : 'https://noname.oki-toki.net/api/v1/imports/tasks/add',
            'test' : 'http://127.0.0.1:8000/crm/test/',
            }
api_token="373a8828ee1b80ab5aa67c90a8f9981c"
def urlgen(r):
    while(r):
        r-=1
        yield api_urls['add-task']

def make_list(leads_db, dialer_id):
    result = []
    for lead in leads_db:
        item = {'Name' : lead[1],
                'phone' : lead[2],
                'dialer_id' : dialer_id}
        result.append(item)

    return result

def make_body(lead):
    global api_token
    
    result = {'api_token': api_token, \
        'phones' : lead['phone'],
        'details' : {'Name' : lead['Name']},
        'bp_id' : 1,
        'dialer_id': lead['dialer_id']
    }
    return result

def make_request(data):
    body = make_body(data)
    header = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    }
    
    return grequests.post(url=api_urls['add-task'], json=body, headers=header)

def exp_api(leads):
    post_list = []
    post_list = (make_request(p) for p in leads)
    return grequests.map(post_list)

def export(session: Session, export_):
    dialer_id = export_['dialer_id']
    leads = session.get_leads_for_export_from_count(export_['count'], export_['category_id'], export_['silent']) #json.loads(export_[1])['ids']    
    templeads = [x for x in leads]
    ids, leads = [x[0] for x in templeads], make_list(templeads, dialer_id)


    
    return ids, (True if x.status_code == 200 else False for x in exp_api(leads))
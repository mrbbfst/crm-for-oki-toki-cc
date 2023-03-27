from django.db import connection

def hostname_from_the_request(request):
    return request.get_host().split(".")[0].lower()
    return request.path.split("/")[1].lower()

def tenant_db_from_the_request(request):
    ccname = hostname_from_the_request(request)
    tenants_map = get_tenants_map()
    return tenants_map.get(ccname)

def get_tenants_map():
    return {
        "crm": "cc1",
        "crm2": "cc2"
    }
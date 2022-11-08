import json
from datetime import date,timedelta
from math import prod

from django.db.models import Q
#from models import Lead as LeadModel
#from ..crm.models import Lead as LeadModel

#from ..crm.models import Product as CategoryModel
from .models import Lead as LeadModel
from .models import Category as CategoryModel
from .models import Dialer as DialerModel
from .windowsilence import getSilentWindow as window
from .windowsilence import excludingDate


def getCategoriesStats(window_days) -> list:
    ret = []
    categoryNames = CategoryModel.objects.all()
    
    period = window(int(window_days))   # 31 replace to const variable or data from database
    for i in categoryNames.values():
        a={
            "category" : i['name'], 
            "count": LeadModel.objects.filter(product=i['id']).count(),
            "countForSend": LeadModel.objects.filter(product=i['id']) \
                .filter(Q(last_send__lte=period) | Q(last_send=None)) \
                .exclude(last_send=excludingDate()) \
                    .count()
            }
        ret.append(a)
    return ret


def getDialers():
    return DialerModel.objects.all()

def getCountLeadsRow():
    return LeadModel.get_count()
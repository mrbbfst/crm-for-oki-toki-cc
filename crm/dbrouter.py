from .middlewares import get_current_db_name
from django.urls import exceptions

class Router:
    def db_for_read(self, model, **hints):
        try:
            if model._meta.app_label != 'crm':
                return 'default'
            return get_current_db_name()
            #return get_current_db_name()
            
        except exceptions.NoReverseMatch:
            return 'default'

    def db_for_write(self, model, **hints):
        try:
            if model._meta.app_label == 'crm':
                return get_current_db_name()
            return 'default'
        except exceptions.NoReverseMatch:
            return 'default'

    def allow_relation(self, *args, **kwargs):
        return True

    def allow_syncdb(self, *args, **kwargs):
        return None

    def allow_migrate(self, *args, **kwargs):
        return None
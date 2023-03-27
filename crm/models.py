from django.db import models
from django.utils import timezone
from django.db.models import Q
from django.db.models import Sum
from .windowsilence import getSilentWindow as window
from django.db.models import QuerySet

import json
import types
# Create your models here.


class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Категории товаров"
        verbose_name = "Категория товаров"
    
    @classmethod
    @staticmethod
    def get_stat(window_) -> list:
        ret = []
        period = window(int(window_))
        for category in Category.objects.all().values():
            active_export = Export.objects.filter(exported=None, category=category['id']).aggregate(Sum('count'))['count__sum']
            stat={
                "category" : category['name'], 
                "count": Lead.objects.filter(product=category['id']).count(),
                "countForSend": Lead.objects.filter(product=category['id']) \
                    .exclude(id__in=ExportLog.objects.values_list('lead',flat=True).filter(at__gt=period)) \
                        .count()  - (active_export if active_export else 0)
                }    
            ret.append(stat)
        return ret

class Lead(models.Model):
    name = models.CharField(max_length=60,null=False)
    phone = models.CharField(max_length=20, null=False, unique=True)
    product = models.ForeignKey(Category, on_delete=models.CASCADE)
    last_export = models.ForeignKey("ExportLog", on_delete=models.DO_NOTHING, default=None, null=True, related_name="last_exported", blank=True)
    geo = models.CharField(max_length=255, null=True, default=None, blank=True)
    


    @property
    def last_send(self):
        return ExportLog.objects.filter(lead=self).order_by('-at').first()

    def __str__(self):
        return self.name
    
    @staticmethod
    def get_count():
        """Maybe need to remove"""
        return Lead.objects.all().count()
    
    class Meta:
        verbose_name_plural = "Контакты"
        verbose_name = "Контакт"

    @classmethod
    @staticmethod
    def create_leads(leads):
        category = Category.objects.get(name=leads['categories'])
        leadsm = (Lead(name=lead['name'], \
            phone=lead['phone'], 
            product=category,
            geo=lead.get('geo')
            ) for lead in leads['leads'])
        count_start = Lead.objects.all().count()
        Lead.objects.bulk_create(leadsm, ignore_conflicts=True)
        count_new = count_start - Lead.objects.all().count()
        #Log.new("В базу добавлено " + str(count_new) + " лидов.")
        return count_new

    @classmethod
    @staticmethod
    def update_field(leads_raw):
        if len(leads_raw['leads']) == 0:
            return 0
        fields = set()
        category = None #leads_raw['categories'] if leads_raw['categories'] is not "None" else None
        if leads_raw['categories'] != "None":
            category = Category.objects.get(name=leads_raw['categories'])
            fields.add('product')
        leads_raw_key_phone = dict()
        for lead in leads_raw['leads']:
            leads_raw_key_phone[lead['phone']] = {}
            if(lead['name']):
                leads_raw_key_phone[lead['phone']]['name'] = lead['name']
            if(lead['geo']):
                leads_raw_key_phone[lead['phone']]['geo'] = lead['geo']
        upd_list =  Lead.objects.filter(phone__in=leads_raw_key_phone.keys()) 
        upd_list_mod = []
        for lead in upd_list:
            if(lead.phone in leads_raw_key_phone.keys()):
                if category is not None:
                    lead.product=category
                if leads_raw_key_phone[lead.phone].get('name'):
                    lead.name = leads_raw_key_phone[lead.phone]['name']
                    fields.add('name')
                if leads_raw_key_phone[lead.phone].get('geo'):
                    lead.geo = leads_raw_key_phone[lead.phone]['geo']
                    fields.add('geo')
                
                upd_list_mod.append(lead)
        return Lead.objects.bulk_update(upd_list_mod, fields=fields)


class Dialer(models.Model):
    dialer_id = models.CharField(max_length=3,unique=True, null=False)
    name = models.CharField(max_length=100,  null=False)
    
    def __str__(self):
        return str(self.name) + ": " + str(self.dialer_id)
    
    class Meta:
        verbose_name_plural = "Номера автообзвона"
        verbose_name = "Номер автообзвона"

class Log(models.Model):
    at = models.DateTimeField(null=False, auto_now_add=True)
    text = models.TextField(null=False)
    
    class Meta:
        verbose_name_plural = "Логи"
        verbose_name = "Лог"
    
    @staticmethod
    def new(text):
        log = Log()
        log.text = text
        log.save()


class Export(models.Model):
    category = models.ForeignKey(Category, on_delete=models.DO_NOTHING)
    count = models.SmallIntegerField(null=False,default=0)
    dialer = models.ForeignKey(Dialer, on_delete=models.DO_NOTHING)
    silent = models.SmallIntegerField(null=False, default=90)
    created = models.DateTimeField(editable=False, default=timezone.now)
    exported = models.DateTimeField(null=True)

    class Meta:
        verbose_name_plural = "Експорти"
        verbose_name = "Експорт"


    
        
    
    def save(self, *args, **kwargs):
        if not self.id:
            self.created = timezone.now()
        #else:
        #    self.exported = timezone.now()
        return super(Export, self).save(*args, **kwargs)
    
    @property
    def stat(self) -> int:
        if self.id:
            return self.count - Export.objects.filter(export=self.id).count()
        else:
            return 0
    
    @classmethod
    @staticmethod
    def all_stat():
        ret = 0
        exported_count = Export.objects.all().exclude(exported=None).aggregate(Sum('count'))['count__sum']
        active_count = Export.objects.filter(exported=None).aggregate(Sum('count'))['count__sum']
        ret += (active_count if active_count else 0)
        ret -= (exported_count if exported_count else 0) 
        #if(active_count):
        all_exported = ExportLog.objects.count()
        ret += all_exported
        return ret

    @classmethod
    @staticmethod
    def create(data):
        export = Export()
        data = json.loads(data)
        export.category = Category.objects.get(name=data['category'])
        export.count = int(data['count'])
        export.dialer = Dialer.objects.get(dialer_id=data['dialer_id'])
        export.silent = int(data['silent'])

    @classmethod
    @staticmethod
    def new(data):
        export = Export.create(data)
        export.save()
        return export.id
    
    @classmethod
    @staticmethod
    def get_last_10():
        result_ = list()
        exs = Export._meta.model.objects.all()
        #if exs is not QuerySet:
        #    return result_
        len(exs)
        pass
        
        for export_ in exs:
            result_.append( {
                'id' : export_.id, 
                'create' : export_.created, 
                'started' : ExportLog.objects.filter(export=export_).order_by('at').values_list('at', flat=True).first(),
                'exported' : export_.exported
            })
        return result_
        return (
            {
                'id' : export_.id, 
                'create' : export_.created, 
                'started' : ExportLog.objects.filter(export=export_).order_by('at').values_list('at', flat=True).first(),
                'exported' : export_.exported
            } for export_ in Export.objects.all().order_by('-id')[:10]
        )


class ExportLog(models.Model):
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE)
    export = models.ForeignKey(Export, on_delete=models.CASCADE)
    at = models.DateTimeField(editable=False, default=timezone.now)
    
    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)
        self.save()
    
    def save(self, *args, **kwargs):
        if not self.id:
            self.created = timezone.now()
        return super(ExportLog, self).save(*args, **kwargs)
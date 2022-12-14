from atexit import register
from django.contrib import admin
from .models import Category, Lead, Dialer, Log

# Register your models here.

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name_view",)

    def name_view(self, obj):
        return obj.name
    name_view.short_description = 'Категория'
    
#admin.site.register(Category)

@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ('id', 'name_view', 'phone_view', 'product_view','last_send_view')
    list_filter = ('last_send', 'product')
    search_fields = ('id', 'name', 'phone')

    def name_view(self, obj):
        return obj.name
    name_view.short_description = 'ФИО'

    def last_send_view(self, obj):
        return obj.last_send
    last_send_view.empty_value_diaplay = "Не отправлялся"
    last_send_view.short_description = "Обзвон"

    def phone_view(self, obj):
        return obj.phone
    phone_view.short_description = "Телефон"

    def geo_view(self, obj):
        return obj.geo
    geo_view.short_description = "Адрес"

    def product_view(self, obj):
        return obj.product
    product_view.short_description = "Категория"
#admin.site.register(Lead)


@admin.register(Dialer)
class DialerAdmin(admin.ModelAdmin):
    list_display = ('name_view', 'dialer_id_view')

    def name_view(self, obj):
        return obj.name
    name_view.short_description = "Название"
    
    def dialer_id_view(self,obj):
        return obj.dialer_id
    dialer_id_view.short_description = "ID автообзвона"

@admin.register(Log)    
class LogAdmin(admin.ModelAdmin):
    list_display = ('at', 'text')

#admin.site.register(Dialer)
from enum import unique
from django.db import models

# Create your models here.


class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Категории товаров"
        verbose_name = "Категория товаров"

class Lead(models.Model):
    name = models.CharField(max_length=60,null=False)
    phone = models.CharField(max_length=20, null=False, unique=True)
    product = models.ForeignKey(Category, on_delete=models.CASCADE)
    last_send = models.DateField(null=True,default=None)
    geo = models.CharField(max_length=255, null=True, default=None)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Контакты"
        verbose_name = "Контакт"

class Dialer(models.Model):
    dialer_id = models.CharField(max_length=3,unique=True, null=False)
    name = models.CharField(max_length=100,  null=False)

    def __str__(self):
        return str(self.name) + ": " + str(self.dialer_id)

    class Meta:
        verbose_name_plural = "Номера автообзвона"
        verbose_name = "Номер автообзвона"
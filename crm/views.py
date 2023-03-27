import json
from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from django.http import HttpResponse
from django.http import HttpResponseBadRequest
from django.contrib.auth.decorators import login_required
import django.core.exceptions as dexept
#from .added import addLeads
#from .added import updateLeads as updateLeadsINDB
#from .senddata import getCountLeadsRow #getCategoriesStats, getDialers,
#from .sender import get_count, send, get_note, add_note
from time import sleep
from datetime import date, datetime, timedelta
from .models import Export
from .models import Category
from .models import Dialer
from .models import Lead
from .models import Log

# Create your views here.


@login_required
def index(request):
    start = datetime.now()
    context = {'categories' : Category.objects.all()} ## list(cat.o.a())
    window_days = request.GET.get('w')
    try:
        if(window_days is None or window_days=='' or int(window_days) == 0):
            return redirect("/crm/?w=90")
    except ValueError:
            return redirect("/crm/?w=90") 
    context["cat_stat"] = Category.get_stat(window_days)
    context['dialers'] = Dialer.objects.all()
    context['countleadrows'] = Lead.objects.all().count()
    context['another_crm'] = 'crm2' if request.get_host().split(".")[0].lower()== 'crm' else 'crm'
    context['exportlog_list'] = Export.get_last_10()
    
    end = datetime.now()-start
    context['timeanswer']= "{:2}.{:02}".format(end.seconds,end.microseconds)
    
    return render(request, 'crm/index.html', context)

@login_required
def addPage(responce):
    return render(responce, 'addLeads/add.html')

@login_required
def upload(responce):
    start = datetime.now()
    try:
        raw = json.loads(responce.body)
    except json.JSONDecodeError:
        return HttpResponseBadRequest("Сервер не зміг обробити данні, оновіть сторінку та спробуйте щє раз.")
    count_added = Lead.create_leads(raw)
    message =  f"В базу добавлено {str(count_added)} лидов."
    Log.new(message)
    start = datetime.now()-start
    #if(start > timedelta(seconds=5)):
    #    add_note("В базу (было добавленно/было обновленно) " + message + " лидов.")

    return JsonResponse(
            {'success': message, 
            'timeanswer': "{:02}.{:02}".format(start.seconds, start.microseconds)
            } )

@login_required
def sendprogress(responce):
    start = datetime.now()
    c =  Export.all_stat() #get_count()
    start = datetime.now()-start
    return JsonResponse({"count" :c, 'timeanswer': "{:02}.{:02}".format(start.seconds,start.microseconds)})

@login_required
def createexport(responce):
    start = datetime.now()
    try:
        a = responce.body
        exportid = Export.new(a)
        end = datetime.now()-start
        message = f"Експорт {exportid} додано в список задач." + \
        "\nЧас виконання запросу " + str(end.seconds) + "." + str(end.microseconds) + " сек."
    
        #add_note(message)
        return HttpResponse(message)
    except (dexept.ObjectDoesNotExist, dexept.ValidationError, json.JSONDecodeError) as e:
        return HttpResponseBadRequest("Сервер не зміг обробити данні, оновіть сторінку та спробуйте щє раз.")
    

    #return JsonResponse(
    #    {'status' : message,
    #    'timeanswer':datetime.now()-start
    #    })

@login_required
def updateleads(responce):
    start = datetime.now()
    #json_body = responce.body
    count = Lead.update_field(json.loads(responce.body))
    #b = updateLeadsINDB(a)
    return JsonResponse(
        {'success' :"Было обновлено " + str(count) + " лидов",
        'timeanswer':datetime.now()-start
        })


@login_required
def getmainnote(responce):
    start = datetime.now()
    context = {}
    context['note'] = get_note()
    context['timeanswer'] = datetime.now()-start
    return JsonResponse(context)

@login_required
def test(responce):
    print(responce.body)
    return JsonResponse({})


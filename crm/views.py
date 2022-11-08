import json
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
import threading
from json import JSONDecodeError
from .added import addLeads, getCategoriesContext
from .added import updateLeads as updateLeadsINDB
from .senddata import getCategoriesStats, getDialers, getCountLeadsRow
from .sender import get_count, send, get_note, add_note
from time import sleep
from datetime import date, datetime, timedelta

# Create your views here.


@login_required
def index(request):
    start = datetime.now()
    context = {'categories' : getCategoriesContext()}
    window_days = request.GET.get('w')
    if(window_days is None or window_days=='' or int(window_days) == 0):
        return redirect('/crm/?w=90')
    context["cat_stat"] = getCategoriesStats(window_days) 
    context['dialers'] = getDialers()
    context['countleadrows'] = getCountLeadsRow()
    
    #threading.Thread(target=send,).start()
    end = datetime.now()-start
    context['timeanswer']= "{:2}.{:02}".format(end.seconds,end.microseconds)
    
    return render(request, 'crm/index.html', context)

@login_required
def addPage(responce):
    return render(responce, 'addLeads/add.html')

@login_required
def up(responce):
    start = datetime.now()
    
    a = responce.body
    b = addLeads(a)
    message =  str(b) 
    
    start = datetime.now()-start
    if(start > timedelta(seconds=5)):
        add_note("В базу (было добавленно/было обновленно) " + message + " лидов.")
    #if(start.seconds>=8):
    #    add_note(message)
        
    return JsonResponse(
            {'success': message, 
            'timeanswer': "{:02}.{:02}".format(start.seconds, start.microseconds)
            } )

@login_required
def sendprogress(responce):
    start = datetime.now()
    c =  get_count()
    start = datetime.now()-start
    return JsonResponse({"count" :c, 'timeanswer': "{:02}.{:02}".format(start.seconds,start.microseconds)})

@login_required
def sendup(responce):
    start = datetime.now()
    a = responce.body
    res = send(a)
    
    #sleep(10)
    end = datetime.now()-start
    message = 'Успешно отправленно ' + str(res) + \
         " лидов из категории " + json.loads(a)['category'] + \
          "\nЗа " + str(end.seconds) + "." + str(end.microseconds) + " сек."
    #if end > timedelta(seconds=10):
    add_note(message)

    return JsonResponse(
        {'status' : message,
        'timeanswer':datetime.now()-start
        })

@login_required
def updateleads(respone):
    start = datetime.now()
    a = respone.body
    b = updateLeadsINDB(a)
    return JsonResponse(
        {'success' :"Было обновлено " + str(b) + " лидов",
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


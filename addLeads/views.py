from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
#from .added import upLead

# Create your views here.

@login_required
def addPage(responce):
    return render(responce, 'addLeads/add.html')

@login_required
def up(responce):
    #upLead(responce.body)
    return JsonResponse({'success': "All is good!"})
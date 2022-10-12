from datetime import timedelta, date

#IN_DAY = 31

def getSilentWindow(days_):
    #global IN_DAY
    return date.today()-timedelta(days=days_)

def excludingDate():
    return date(2001,9,11)
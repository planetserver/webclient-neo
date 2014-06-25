from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.shortcuts import get_object_or_404

from django.contrib.auth import authenticate, login, logout
import json
from django.contrib.auth.models import User

from django.core import serializers
from django.contrib.gis.geos import GEOSGeometry
from planetaryDB.models import PlanetServerPoint, PlanetServerLine, PlanetServerPolygon
from django.conf import settings

def showIndex(request):
    if settings.DEBUG:
        return render_to_response('index.tmpl.html')
    return render_to_response('index.html')

def check_logged(request):
    response_data = {}
    if request.user.is_authenticated():
        # Do something for authenticated users.
        response_data['logged'] = True
    else:
        # Do something for anonymous users.
        response_data['logged'] = False
    return HttpResponse(json.dumps(response_data), content_type="application/json")

def request_login(request):
    if request.method == 'POST':
        requser = request.POST['username']
        reqpass = request.POST['password']
        user = authenticate(username=requser, password=reqpass)
        response_data = {}
        if user is not None:
            if user.is_active:
                login(request, user)
                # Return a success message
                response_data['response'] = '1'
                response_data['message'] = 'Logged in'
                response_data['user'] = user.get_full_name()
                response_data['usern'] = user.get_username()
                request.session['iduser'] = user.pk
                return HttpResponse(json.dumps(response_data), content_type="application/json")
            else:
                # Return a 'disabled account' error message
                response_data['response'] = '2'
                response_data['message'] = 'This account is disabled. Please contact administrator.'
                return HttpResponse(json.dumps(response_data), content_type="application/json")
        else:
            # Return an 'invalid login' error message.
            response_data['response'] = '3'
            response_data['message'] = 'Wrong username and/or password. Please try again.'
            return HttpResponse(json.dumps(response_data), content_type="application/json")

def request_logout(request):
    logout(request)
    return HttpResponse("true", content_type="text/plain")

def save_geom(request):
    # delete old data from db
    PlanetServerPoint.objects.filter(user_id__exact=request.session['iduser']).delete()
    PlanetServerLine.objects.filter(user_id__exact=request.session['iduser']).delete()
    PlanetServerPolygon.objects.filter(user_id__exact=request.session['iduser']).delete()
    # save new data into db
    features = request.POST.getlist('features')
    usr = User.objects.get(pk=request.session['iduser'])
    for feature in features:
        geom = GEOSGeometry(feature)
        if geom.geom_typeid == 0:
            # it's a Point
            row = PlanetServerPoint(name='Point', mpoint=geom.wkt, user=usr)
            row.save()
        if geom.geom_typeid == 1:
            # it's a LineString
            row = PlanetServerLine(name='LineString', mline=geom.wkt, user=usr)
            row.save()
        if geom.geom_typeid == 3:
            # it's a Polygon
            row = PlanetServerPolygon(name='Polygon', mpolygon=geom.wkt, user=usr)
            row.save()
    response_data = {}
    response_data['response'] = 'stored'
    return HttpResponse(json.dumps(response_data), content_type="application/json")

def load_geom(request):
    qs_point = PlanetServerPoint.objects.filter(user_id__exact=request.session['iduser']).values('mpoint')
    qs_line = PlanetServerLine.objects.filter(user_id__exact=request.session['iduser']).values('mline')
    qs_poly = PlanetServerPolygon.objects.filter(user_id__exact=request.session['iduser']).values('mpolygon')
    point=''; line=''; poly=''
    for data in qs_point:
        geom = GEOSGeometry(data['mpoint'])
        point = point + geom.wkt
    for data in qs_line:
        geom = GEOSGeometry(data['mline'])
        line = line + geom.wkt
    for data in qs_poly:
        geom = GEOSGeometry(data['mpolygon'])
        poly = poly + geom.wkt
    from itertools import chain
    result_list = list(chain(point, ';', line, ';', poly,))
    return HttpResponse(result_list, content_type="text/plain")

def clear_all_geom(request):
    if request.method == 'POST':
        if request.user.is_authenticated():
            response_data = {}
            # delete old data from db
            PlanetServerPoint.objects.filter(user_id__exact=request.session['iduser']).delete()
            PlanetServerLine.objects.filter(user_id__exact=request.session['iduser']).delete()
            PlanetServerPolygon.objects.filter(user_id__exact=request.session['iduser']).delete()
            response_data['deleted'] = True
            return HttpResponse(json.dumps(response_data), content_type="application/json")

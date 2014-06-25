from django.db import models
from django.contrib.gis.db import models
from django.contrib.auth.models import User

class PlanetServerPoint(models.Model):
        name = models.CharField(max_length=50, null=True)
        mpoint = models.PointField()
        objects = models.GeoManager()
        elev = models.FloatField(null=True)
        spectrum = models.CharField(max_length=50, null=True)
        text = models.CharField(max_length=200, null=True)
        user = models.ForeignKey(User)
        # Returns the string representation of the model.
        # Note: on Python 3: def __str__(self): on Python 2: def __unicode__(self):
        def __unicode__(self):
                return self.name

class PlanetServerLine(models.Model):
        name = models.CharField(max_length=50, null=True)
        mline = models.LineStringField()
        objects = models.GeoManager()
        crosssection = models.FloatField(null=True)
        text = models.CharField(max_length=200, null=True)
        length = models.FloatField(null=True)
        user = models.ForeignKey(User)
        # Returns the string representation of the model.
        # Note: on Python 3: def __str__(self): on Python 2: def __unicode__(self):
        def __unicode__(self):
                return self.name

class PlanetServerPolygon(models.Model):
        name = models.CharField(max_length=50, null=True)
        mpolygon = models.PolygonField()
        objects = models.GeoManager()
        area = models.FloatField(null=True)
        avgspectrum = models.CharField(max_length=50, null=True)
        text = models.CharField(max_length=200, null=True)
        user = models.ForeignKey(User)
        # Returns the string representation of the model.
        # Note: on Python 3: def __str__(self): on Python 2: def __unicode__(self):
        def __unicode__(self):
                return self.name

# How to install Neo PS client step-by-step

## Installing CentOS
Get CentOS at http://www.centos.org.
Current version installed in this guide is CentOS 6.5 and set of software is “Software Development Workstation”.
Versions of software packages to be installed:
* Python 2.6.6
* Django: 1.5.1
* Postgresql: 9.3
* psycopg2: 2.0.14
* GEOS: 3.3.8
* PROJ: 4.8.0
* GDAL: 1.9.0
* Postgis: 1.5.8

## Installing Python (version 2.6.6)
Get Python at http://www.python.org. 
If you’re running Linux or Mac OS X, you probably already have it installed.

## Install Django (version 1.5.1)
This is the recommended way to install Django.
1. Install pip. The easiest is to use the standalone pip installer. Follow this instruction (http://www.pip-installer.org/en/latest/installing.html). If your distribution already has pip installed, you might need to update it if it’s outdated. (If it’s outdated, you’ll know because installation won’t work.)
2. Enter the command sudo pip install Django==1.5.1 at the shell prompt. This will install Django in your Python installation’s site-packages directory.
3. Show Django was installed: enter the command pip show Django.
More details at https://docs.djangoproject.com/en/1.5/topics/install/

## Install Postgresql (version 8.4.18)
Follow this steps to install database: http://wiki.postgresql.org/wiki/YUM_Installation

## Install psycopg2
Using PostgreSQL, you’ll need the postgresql_psycopg2 package. Follow this link http://initd.org/psycopg/ to download and install it.

## Install GEOS, PROJ and GDAL
Follow instructions on this link: https://docs.djangoproject.com/en/1.5/ref/contrib/gis/install/geolibs/

## Installing PostGIS
PostGIS adds geographic object support to PostgreSQL, turning it into a spatial database. GEOS, PROJ.4 and GDAL should be installed prior to building PostGIS. (link: https://docs.djangoproject.com/en/1.5/ref/contrib/gis/install/postgis/)

Configuration	
Copy Neo client file in a folder (for example /home/user/projects/neo) and change configuration in file settings.py.		

```
DATABASES = {		
  'default': {		
    'ENGINE': 'django.contrib.gis.db.backends.postgis', # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.	
    'NAME': 'dbtesting',                      # Or path to database file if using sqlite3.	
    'USER': 'test',      # The following settings are not used with sqlite3:	
    'PASSWORD': 'test',	
    'PORT': '5432', # Set to empty string for default.		
  }		
}	
```

After changes, type in shell: python manage.py syncdb	
After database synchronization, type: python manage.py runserver	
Create user for testing	
Type in shell: python manage.py shell
In python shell type the follow strings:	

```
from django.contrib.auth.models import User	
user = User.objects.create_user('test', ‘test@testing.com', 'test', first_name='Test', last_name='Test')		
```

Software installed on VM with CentOS 6.5.	

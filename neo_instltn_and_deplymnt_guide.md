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
DATABASES = {	
    'default': {	
	'ENGINE': 'django.contrib.gis.db.backends.postgis', # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.	
        'NAME': 'dbtesting',                      # Or path to database file if using sqlite3.	
        'USER': 'test',      # The following settings are not used with sqlite3:	
 	'PASSWORD': 'test',	
        'HOST': '127.0.0.1',  # Empty for localhost through domain sockets or '127.0.0.1' for localhost through TCP.	
        'PORT': '5432', # Set to empty string for default.	
    }	
}	
After changes, type in shell: python manage.py syncdb	
After database synchronization, type: python manage.py runserver	
Create user for testing	
Type in shell: python manage.py shell
In python shell type the follow strings:	
>>> from django.contrib.auth.models import User	
>>> user = User.objects.create_user('test', ‘test@testing.com', 'test', first_name='Test', last_name='Test')	
Software installed on VM with CentOS 6.5.	

## SVN Configuration and Neo code download
Steps to download and run neo source code: 

1. Create a folder where you want to deploy source code (i.e. /home/user/projects/svn)
2. Type in shell: svn co http://www.earthserver.eu/svn/earthserver/src/WP260_Planetary-Service/neo --username <username> --password <password>
3. Waiting for source code download (it take a while).
4. You could change settings in file planet/settings.py at the line “DATABASES” in according to your previous configuration. In general, you must have a database name, a username and password.
5. Enter neo directory (cd neo) and type in shell: python manage.py syncdb and after python manage.py runserver
6. Open browser and type on url bar: 127.0.0.1:8000 and you should see an image like one below

Obviously to get source code you need an account on EarthServer SVN. If you did not yet get it, please contact the planetserver-dev list (planetserver-dev@googlegroups.com).

## Neo Development VM for VirtualBox
If installing from scratch is boring, we already did it for you! Sorry for not saying that, before!
You can now download a copy of this virtual machine at the following URL  http://www.faculty.jacobs-university.de/anrossi/shared/stefan/vmcentos6.5.rar	

Here follows the list of predefined users:	
| User name| Password	| Group	     | 
|----------|:----------:|-----------:|
|root 	   |earthserver | root	     |
|swingit   |swingit2013 |root,swingit|
|earthserver| earthserver|earthserver|	


Table 1 – System Account	
The size of the NeoDevVM_CentOS_6_5.rar file is 2.xx Gbyte. Chech your downloaded file through these checksums:

MD5: CEEE114878EE4C04FE0CAD138052C9F2
SHA1: DF62DA8786E9563696D75583CBBE146BFC98577D



@author: Leonardo Trovato  
@company: Software Engineering Italia – Swing:It  
@released: Jan 27, 2014  
@lastmodification: Jan 27, 2014  
@changelog: 1.0, first release.  

#Installing CentOS
Install CentOS from http://www.centos.org. This guide uses CentOS 7.

#Required packages
##Install python-2.7. 
  If you are using CentOS 7, python-2.7 should be already installed. This guide uses python-2.7.
  You can get python from http://www.python.org.

##Install Django 1.5.4
  *cd /usr/local/src
  *wget https://pypi.python.org/packages/source/s/setuptools/setuptools-2.1.tar.gz --no-check-certificate
  *gzip -d < setuptools-2.1.tar.gz | tar xvf - 
  *cd /usr/local/src/setuptools-2.1
  *python ez_setup.py
  *easy_install pip
  *pip install -U django==1.5.4
  
##Install postgresql-9.3
Installation instruction can be found at https://wiki.postgresql.org/wiki/YUM_Installation. For
64 bit CentOS platform, you can use : 

yum localinstall http://yum.postgresql.org/9.3/redhat/rhel-6-x86_64/pgdg-centos93-9.3-1.noarch.rpm
yum install postgresql93 postgresql93-contrib postgresql93-devel postgresql93-libs postgresql93-server

##Install psycopg2-2.5.3
Using PostgreSQL, you’ll need the postgresql_psycopg2 package. Follow this link http://initd.org/psycopg/ to download and install it.

After completing the instructions above on a CentOS 7 platform, you can use the commands.
yum install postgresql-libs
yum install python-psycopg2

##Install GEOS, PROJ and GDAL
Follow instructions on this link: 
https://docs.djangoproject.com/en/1.5/ref/contrib/gis/install/geolibs/

##Install postgis
yum install postgresql93-server postgis2_93

https://docs.djangoproject.com/en/1.5/ref/contrib/gis/install/geolibs/

###Now perform a few post-installation setup commands

service postgresql-9.3 initdb
service postgresql-9.3 start
chkconfig postgresql-9.3 on

###Spatially enabling a database 

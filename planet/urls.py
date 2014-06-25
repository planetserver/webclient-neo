from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'planet.views.home', name='home'),
    # url(r'^planet/', include('planet.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
	
	url(r'^$', "views.showIndex"),
    #url(r'^new/', "views.showIndex"),
    url(r'^request_login$', "views.request_login"),
    url(r'^request_logout$', "views.request_logout"),
    url(r'^save_geom$', "views.save_geom"),
    url(r'^load_geom$', "views.load_geom"),
    url(r'^check_logged$', "views.check_logged"),
    url(r'^clear_all_geom$', "views.clear_all_geom"),
)

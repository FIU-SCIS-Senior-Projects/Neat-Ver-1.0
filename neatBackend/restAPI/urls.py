from django.conf.urls import url, include
from rest_framework import routers
from restAPI import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'school', views.SchoolViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^docs/', include('rest_framework_docs.urls')),
    url(r'^auth/(?P<usr>[a-z0-9]+)/(?P<pw>[a-z0-9]+)/$', views.AuthView.as_view())
]

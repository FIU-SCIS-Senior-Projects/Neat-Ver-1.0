from django.conf.urls import url, include
from rest_framework import routers
#from restAPI import views
from . import views
from rest_framework.authtoken import views as authviews
from rest_framework.urlpatterns import format_suffix_patterns

router = routers.DefaultRouter()
router.register(r'schools', views.SchoolViewSet)
router.register(r'schoolrosters', views.SchoolRosterViewSet)
router.register(r'profile', views.ProfileViewSet)
router.register(r'classes', views.ClassViewSet)
router.register(r'classrosters', views.ClassRosterViewSet)
router.register(r'assignments', views.AssignmentViewSet)
router.register(r'task', views.TaskViewSet)
router.register(r'user', views.UserViewSet)
router.register(r'group', views.GroupViewSet)
router.register(r'assignmentroster', views.AssignmentRosterViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^login/', authviews.obtain_auth_token, name="login"),
    url(r'^receive/emailCode/(?P<code>[a-z0-9]+)/', views.receiveEmailCode),
    url(r'^send/emailCode/', views.sendEmailCode),
    url(r'^send/passwordCode/(?P<email>[a-z0-9@.]+)/', views.sendPasswordCode),
    url(r'^changePassword/(?P<code>[a-z0-9]+)/', views.changePassword),
    url(r'^getAssigProgress/(?P<pk>[a-z0-9]+)/', views.getAssigProgressView),
    url(r'^collab/assig/(?P<pk>[a-z0-9]+)/', views.CollabView),
    # url(r'^auth/(?P<usr>[a-z0-9]+)/(?P<pw>[a-z0-9]+)/$', views.AuthView.as_view()),
]

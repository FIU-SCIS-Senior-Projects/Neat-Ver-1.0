from django.conf.urls import url, include
from rest_framework import routers
from restAPI import views
from . import views
from rest_framework.authtoken import views as authviews

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'school', views.SchoolViewSet)
router.register(r'schoolroster', views.SchoolRosterViewSet)
router.register(r'userinfo', views.UserInfoViewSet)
router.register(r'class', views.ClassViewSet)
router.register(r'classroster', views.ClassRosterViewSet)
router.register(r'assginment', views.AssignmentViewSet)
router.register(r'task', views.TaskViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    url(r'^restapi/', include(router.urls)),
    url(r'^register/', views.RegisterView.as_view()),
    url(r'^login/', authviews.obtain_auth_token),
    # url(r'^auth/(?P<usr>[a-z0-9]+)/(?P<pw>[a-z0-9]+)/$', views.AuthView.as_view()),

]

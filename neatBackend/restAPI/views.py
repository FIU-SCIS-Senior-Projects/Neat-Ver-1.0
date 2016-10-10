#models
from django.contrib.auth.models import *
from rest_framework.authtoken.models import Token
from restAPI.models import *
#serializers
from restAPI.serializers import *
#viewsets
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.viewsets import ViewSet
#classviews
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
#generic classes
from rest_framework import generics
#authentication
from django.contrib.auth import authenticate
from rest_framework.authentication import TokenAuthentication
#permissions
from rest_framework import permissions
from restAPI.permissions import *
#filters
from rest_framework import filters
#from rest_framework.filters import DjangoFilterBackend
#dates
from django.utils import timezone
import datetime

#For converting google oAuth code
from rest_framework_social_oauth2.views import ConvertTokenView

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows School to be viewed or posted.
    """
    #authentication_classes = (TokenAuthentication,)
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('username',)
    #permission_classes = (CustomObjectPermissions,)
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer


class SchoolViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows School to be viewed or posted.
    """
    authentication_classes = (TokenAuthentication,)
    filter_backends = (filters.DjangoObjectPermissionsFilter,)
    permission_classes = (CustomObjectPermissions,)
    queryset = School.objects.all()
    serializer_class = SchoolSerializer

#TODO : Figure out how to set foreign keys in django admin
#TODO : Figure out how to allow updating of model fields
class SchoolRosterViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows SchoolRosters to be viewed
    """
    queryset = SchoolRoster.objects.all()
    serializer_class = SchoolRosterSerializer


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer



class ClassViewSet(viewsets.ModelViewSet):
    permission_classes = (IsOwnerCanEditAnyCanCreate,)
    queryset = Class.objects.all()
    serializer_class = ClassSerializer


class ClassRosterViewSet(viewsets.ModelViewSet):
    queryset = ClassRoster.objects.all()
    serializer_class = ClassRosterSerializer


class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


@api_view(['GET'])
def oauth_code(request):
   g_code = request.GET['code']
   return Response(g_code)

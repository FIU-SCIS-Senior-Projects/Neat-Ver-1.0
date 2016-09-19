#models
from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from restAPI.models import *
#serializers
from restAPI.serializers import *
#viewsets
from rest_framework import viewsets
#classviews
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
#generic classes
from rest_framework import generics
#authentication
from django.contrib.auth import authenticate
#filters
from rest_framework.filters import DjangoFilterBackend
#datees
from django.utils import timezone
import datetime


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


class SchoolViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows School to be viewed or posted.
    """
    queryset = School.objects.all()
    serializer_class = SchoolSerializer

#TODO : Figure out how to set foreign keys in django admin
#TODO : Figure out how to allow editing of model fields
class SchoolRosterViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows SchoolRosters to be viewed
    """
    queryset = SchoolRoster.objects.all()
    serializer_class = SchoolRosterSerializer


class UserInfoViewSet(viewsets.ModelViewSet):
    queryset = UserInfo.objects.all()
    serializer_class = UserInfoSerializer


class ClassViewSet(viewsets.ModelViewSet):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer


class ClassRosterViewSet(viewsets.ModelViewSet):
    queryset = ClassRoster.objects.all()
    serializer_class = ClassRosterSeriazlier


class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
"""
/myapp/auth/usr/pw
Given usr and pw, authenticate and return user object.
ie: /myapp/auth/andresgalban/hollywood (if user is created), otherwise 404
For reference also see: AuthSerializer in serializes.py, url that corresponds to
"""
class AuthView(APIView):
    #my own method that authenticates based on input from URL
    def get_object(self, usr, pw):
        user = authenticate(username=usr, password=pw)
        if user is not None:
            # the password verified for the user
            return User.objects.get(username=usr)
        else:
            # the authentication system was unable to verify the username and password
            raise Http404

    def get(self, request, usr, pw, format=None):
        user = self.get_object(usr, pw)
        serializer = AuthSerializer(user)
        return Response(serializer.data)

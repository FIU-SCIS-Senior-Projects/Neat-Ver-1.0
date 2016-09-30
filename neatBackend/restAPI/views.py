#python
from collections import OrderedDict
#models
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from restAPI.models import *
#serializers
from restAPI.serializers import *
#viewsets
from rest_framework import viewsets
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
from .permissions import *
#filters
from rest_framework.filters import DjangoFilterBackend
#dates
from django.utils import timezone
import datetime

class UsersViewSet(viewsets.ModelViewSet):
    #permission_classes = (permissions.IsAdminUser,)
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

class UserView(APIView):
    authentication_classes = (TokenAuthentication,)
    #permission_classes = (permissions.IsAdminUser,)

    def get(self, request, format=None):
        """
        Return user info given a token
        """
        return Response(UserSerializer(request.user, context={'request': request}).data)

class RegisterViewSet(ViewSet):

    def create(self, request, format=None):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            #create user
            usr = serializer.create(serializer.validated_data)
            returnDict = OrderedDict(ResponseString= "user created", userPK=usr.pk)
            return Response(returnDict) # TODO: should this return the created url for user?
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SchoolViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows School to be viewed or posted.
    """
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


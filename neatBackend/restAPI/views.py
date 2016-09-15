#models
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework import viewsets
#serializers
from .serializers import RegisterSerializer, UserSerializer
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

"""
/users/
list of users
"""

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

"""
/register/
create users
"""
class RegisterView(APIView):

    def put(self, request, format=None):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            #create user
            usr = serializer.create(serializer.validated_data)
            #create token
            #Token.objects.get_or_create(user=usr)
            #return Response(serializer.data)
            return Response("user created")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
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
from rest_framework.decorators import detail_route, list_route
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
#email
from django.core.mail import send_mail
import hashlib, random

class SendEmailView(APIView):

    authentication_classes = (TokenAuthentication,)
    #permission_classes = (permissions.IsAdminUser,)

    #Create a new code and send an e-mail to the user
    def post(self, request, field, format=None):
        if field not in ['email', 'password']:
            return Response({'error': 'wrong field'},status=status.HTTP_404_NOT_FOUND)
        else:
            user = request.user
            profile = user.profile
            code = self.genCode(user.username)
            if field == 'email':
                profile.emailCode = code
            else:
                profile.passwordCode = code
            profile.save()

            subject = 'Verification e-mail'
            body = 'Here is your code: ' + code
            fromEmail = 'gfern022@fiu.edu'
            send_mail(
                subject,
                body,
                fromEmail,
                [request.user.email],
                fail_silently=False,
            )

            return Response({'status': 'e-mail sent'})

    def genCode(self, username):
        salt = hashlib.sha256()
        salt.update(str(random.random()).encode('utf-8')[:5])
        salt.update(username.encode('utf-8'))
        return salt.hexdigest()[:5]

class VerifyView(APIView):

    authentication_classes = (TokenAuthentication,)
    #permission_classes = (permissions.IsAdminUser,)

    #verify the user's e-mail or password given a code
    def post(self, request, field, code, format=None):
        if field not in ['email', 'password']:
            return Response({'error': 'wrong field'},status=status.HTTP_404_NOT_FOUND)
        else:
            user = request.user
            profile = user.profile
            if field == 'email':
                if code == profile.emailCode:
                    profile.verified = True
                    profile.save()
                    return Response({'status': user.email + ' verified'})
                else:
                    return Response({'status': 'wrong code provided'},status=status.HTTP_400_BAD_REQUEST)
            else:
                if code == profile.passwordCode:
                    return Response({'status': 'code ' + code + ' matches'})
                else:
                    return Response({'status': 'wrong code provided'},status=status.HTTP_400_BAD_REQUEST)

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
    #authentication_classes = (TokenAuthentication,)
    filter_backends = (filters.DjangoObjectPermissionsFilter,)
    #permission_classes = (CustomObjectPermissions,)
    queryset = School.objects.all()
    serializer_class = SchoolSerializer

#TODO : Figure out how to set foreign keys in django admin
#TODO : Figure out how to allow updating of model fields
class SchoolRosterViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows SchoolRosters to be viewed
    """
    authentication_classes = (TokenAuthentication,)
    queryset = SchoolRoster.objects.all()
    serializer_class = SchoolRosterSerializer


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    

class ClassViewSet(viewsets.ModelViewSet):
    #permission_classes = (IsOwnerCanEditAnyCanCreate,)
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

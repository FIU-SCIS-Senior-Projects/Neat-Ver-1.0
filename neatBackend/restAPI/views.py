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
from rest_framework.decorators import detail_route, list_route, api_view, authentication_classes
#generic classes
from rest_framework import generics
#authentication
from django.contrib.auth import authenticate
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
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



#verify a user's e-mail given a code
@api_view(['post'])
@authentication_classes([TokenAuthentication])
def receiveEmailCode(request, code):
    user = request.user
    profile = user.profile
    if code == profile.emailCode:
        profile.verified = True
        profile.save()
        return Response({'status': user.email + ' verified'})
    else:
        return Response({'status': 'wrong code provided'},status=status.HTTP_400_BAD_REQUEST)

#send a user a new code to verify their e-mail
@api_view(['post'])
@authentication_classes([TokenAuthentication])
def sendEmailCode(request):
    user = request.user
    profile = user.profile
    code = genCode(user.username)
    profile.emailCode = code
    profile.save()
    #e-mail start
    subject = 'Neat E-mail Verification'
    body = 'Here is your code: ' + code
    fromEmail = 'gfern022@fiu.edu'
    send_mail(
        subject,
        body,
        fromEmail,
        [request.user.email],
        fail_silently=False,
    )
    return Response({'status': 'E-mail code sent'})

#send a user a new code to reset or change their password
@api_view(['post'])
def sendPasswordCode(request, email):
    user = User.objects.filter(email=email)
    if user.count() is 0:
            return Response({'error': 'E-mail provided not in database'},status=status.HTTP_400_BAD_REQUEST)
    user = user[0]
    profile = user.profile
    code = genCode(user.username)
    profile.passwordCode = code
    profile.save()
    #e-mail start
    subject = 'Neat Password Code'
    body = 'Here is your code: ' + code
    fromEmail = 'gfern022@fiu.edu'
    send_mail(
        subject,
        body,
        fromEmail,
        [email],
        fail_silently=False,
    )
    return Response({'status': 'Password code sent'})

#change user's password given a code
@api_view(['post'])
def changePassword(request, code):
    serializer = SimpleUserSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        user = User.objects.filter(email=request.data.get('email'))
        if user.count() is 0:
            return Response({'error': 'e-mail provided not in database'},status=status.HTTP_400_BAD_REQUEST)
        user = user[0]
        passcode = user.profile.passwordCode
        if passcode != code:
            return Response({'status': 'wrong code provided'},status=status.HTTP_400_BAD_REQUEST)
        user.set_password(request.data.get('password'))
        user.save()
        return Response({'status': 'password set'})
    else:
        return Response(serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST)
        
def genCode(username):
    salt = hashlib.sha256()
    salt.update(str(random.random()).encode('utf-8')[:5])
    salt.update(username.encode('utf-8'))
    return salt.hexdigest()[:5]

#Get user progress for an assignment, given assignment pk
@api_view(['get'])
@authentication_classes([TokenAuthentication])
def getAssigProgressView(request, pk):
    taskNum, taskProg = 0, 0
    assig = Assignment.objects.filter(pk=pk)
    if assig.count() is 0:
        return Response({'error': 'assignment provided not in database'},status=status.HTTP_400_BAD_REQUEST)
    else:
        assig = assig[0]
        for task in assig.tasks.filter(user=request.user):
            taskNum += 1
            if task.isDone == True:
                taskProg += 1
        if taskNum == 0:
            return Response({'error': 'this user has no tasks in this assignment'},status=status.HTTP_400_BAD_REQUEST)
        return Response({'percentage': (taskProg/taskNum)})

#Get assignment statistics, given assignment pk
@api_view(['get'])
@authentication_classes([TokenAuthentication])
def CollabView(request, pk):
    assig = Assignment.objects.filter(pk=pk)
    array = []
    if assig.count() is 0:
        return Response({'error': 'assignment provided not in database'},status=status.HTTP_400_BAD_REQUEST)
    else:
        assig = assig[0]
        for rosterObj in AssignmentRoster.objects.filter(assignment=assig):
            taskNum, taskProg = 0, 0
            for task in assig.tasks.filter(user=rosterObj.user):
                taskNum += 1
                if task.isDone == True:
                    taskProg += 1
            if taskNum != 0:
                array.append({'user': rosterObj.user.email, 'name': rosterObj.user.first_name, 'percentage': (taskProg/taskNum)})
        return Response(array)


#For converting google oAuth code
from rest_framework_social_oauth2.views import ConvertTokenView

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows School to be viewed or posted.
    """
    #authentication_classes = (TokenAuthentication,)
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('email', 'first_name', 'last_name', 'groups', 'profile')
    #permission_classes = (CustomObjectPermissions,)
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

    @list_route(methods=['get'],authentication_classes=[TokenAuthentication])
    def getFromToken(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class SchoolViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows School to be viewed or posted.
    """
    authentication_classes = (TokenAuthentication,)
    #filter_backends = (filters.DjangoObjectPermissionsFilter,filters.DjangoFilterBackend,)
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('schoolName', 'schoolID')
    #permission_classes = (CustomObjectPermissions,)
    queryset = School.objects.all()
    serializer_class = SchoolSerializer

class SchoolRosterViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows SchoolRosters to be viewed
    """
    authentication_classes = (TokenAuthentication,)
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('school', 'user', 'schoolYear')
    queryset = SchoolRoster.objects.all()
    serializer_class = SchoolRosterSerializer


class ProfileViewSet(viewsets.ModelViewSet):
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('grade', 'age', 'gender', 'verified', 'emailCode', 'passwordCode')
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    

class ClassViewSet(viewsets.ModelViewSet):
    #permission_classes = (IsOwnerCanEditAnyCanCreate,)
    authentication_classes = (TokenAuthentication,)
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('className', 'classID', 'school', 'roster')
    queryset = Class.objects.all()
    serializer_class = ClassSerializer


class ClassRosterViewSet(viewsets.ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('classFK', 'user')
    queryset = ClassRoster.objects.all()
    serializer_class = ClassRosterSerializer

class AssignmentRosterViewSet(viewsets.ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('assignment', 'user')
    queryset = AssignmentRoster.objects.all()
    serializer_class = AssignmentRosterSerializer

class AssignmentViewSet(viewsets.ModelViewSet):
    authentication_classes = (TokenAuthentication, BasicAuthentication)
    permission_classes = (permissions.IsAuthenticated,)
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('assignmentName', 'startDate', 'dueDate', 'classFK', 'tasks')
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer

class TaskViewSet(viewsets.ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('assignment', 'user', 'taskName', 'isDone', 'hoursPlanned', 'hoursCompleted', 'startDate', 'endDate')
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

@api_view(['GET'])
def oauth_code(request):
   g_code = request.GET['code']
   return Response(g_code)

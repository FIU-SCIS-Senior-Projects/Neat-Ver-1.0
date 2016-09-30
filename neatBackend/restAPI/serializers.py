import logging

from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from rest_framework import serializers

from .models import *

logger = logging.getLogger(__name__)



#TODO: add schoolRoster such that it doesn't mess with register
class UserInfoSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = UserInfo
        fields = ('url', 'grade', 'age', 'gender')


class UserSerializer(serializers.HyperlinkedModelSerializer):
    userInfo = UserInfoSerializer(read_only=True)

    class Meta:
        model = User
        fields = ('url', 'pk', 'username', 'first_name', 'last_name', 'email', 'groups', 'userInfo')


class RegisterSerializer(serializers.HyperlinkedModelSerializer):
    # Nested userInfo object
    userInfo = UserInfoSerializer()

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'userInfo',)

    def create(self, validated_data):
        usr = validated_data.get('username')
        eml = validated_data.get('email')
        psw = validated_data.get('password')
        userInfoData = validated_data.pop('userInfo')
        user = User.objects.create_user(username=usr, email=eml, password=psw)
        UserInfo.objects.create(user = user, **userInfoData)
        return user


class SchoolSerializer(serializers.HyperlinkedModelSerializer):
    roster = serializers.StringRelatedField(many=True, required=False)
    classes = serializers.StringRelatedField(many=True, required=False)

    class Meta:
        model = School
        fields = ('url', 'schoolName', 'schoolID', 'classes', 'roster', 'owner')


class SchoolRosterSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = SchoolRoster
        fields = ('url', 'schoolYear', 'school', 'user')

class ClassSerializer(serializers.HyperlinkedModelSerializer):
    roster = serializers.StringRelatedField(many=True, required=False)

    class Meta:
        model = Class
        fields = ('url', 'className', 'classID', 'school', 'roster', 'owner')


class ClassRosterSeriazlier(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = ClassRoster
        fields = ('url', 'classFK', 'user')


class AssignmentSerializer(serializers.HyperlinkedModelSerializer):
    tasks = serializers.StringRelatedField(many=True, required=False)

    class Meta:
        model = Assignment
        fields = ('url', 'assignmentName', 'startDate', 'dueDate', 'classFK', 'tasks', 'owner')


class TaskSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Task
        fields = ('url', 'taskName', 'isDone', 'hoursPlanned', 'hoursCompleted', 'startDate', 'endDate', 'assignment', 'owner')
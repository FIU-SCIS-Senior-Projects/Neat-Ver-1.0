import logging
from django.contrib.auth.models import *
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from rest_framework import serializers
from guardian.shortcuts import assign_perm
from .models import *

logger = logging.getLogger(__name__)

#TODO: add schoolRoster such that it doesn't mess with register
class ProfileSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Profile
        fields = ('url', 'grade', 'age', 'gender')


class UserSerializer(serializers.HyperlinkedModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ('url', 'pk', 'username', 'first_name', 'last_name', 'email', 'groups', 'profile')

    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.content = validated_data.get('content', instance.content)
        instance.created = validated_data.get('created', instance.created)
        instance.save()
        return instance


class RegisterSerializer(serializers.HyperlinkedModelSerializer):
    profile = ProfileSerializer()

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'profile',)

    def create(self, validated_data):
        usr = validated_data.get('username')
        eml = validated_data.get('email')
        psw = validated_data.get('password')
        profileData = validated_data.pop('profile')
        user = User.objects.create_user(username=usr, email=eml, password=psw)
        Profile.objects.create(user = user, **profileData)
        return user


class SchoolSerializer(serializers.HyperlinkedModelSerializer):
    #roster = serializers.StringRelatedField(many=True, required=False)
    #classes = serializers.StringRelatedField(many=True, required=False)
    """
    owner = serializers.HyperlinkedRelatedField(
        many=False,
        read_only=True,
        view_name='user-detail'
    )
    """

    class Meta:
        model = School
        fields = ('url', 'schoolName', 'schoolID',)

    def create(self, validated_data):
        name = validated_data.get('schoolName')
        sID = validated_data.get('schoolID')
        usr = self.context['request'].user
        school = School.objects.create(schoolName=name, schoolID=sID)
        assign_perm('view_school', usr, school)
        assign_perm('change_school', usr, school)
        assign_perm('delete_school', usr, school)
        return school

class SchoolRosterSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = SchoolRoster
        fields = ('url', 'schoolYear', 'school', 'user')

class ClassSerializer(serializers.HyperlinkedModelSerializer):
    roster = serializers.StringRelatedField(many=True, required=False)

    class Meta:
        model = Class
        fields = ('url', 'className', 'classID', 'school', 'roster')


class ClassRosterSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = ClassRoster
        fields = ('url', 'classFK', 'user')


class AssignmentSerializer(serializers.HyperlinkedModelSerializer):
    tasks = serializers.StringRelatedField(many=True, required=False)

    class Meta:
        model = Assignment
        fields = ('url', 'assignmentName', 'startDate', 'dueDate', 'classFK', 'tasks')


class TaskSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Task
        fields = ('url', 'taskName', 'isDone', 'hoursPlanned', 'hoursCompleted', 'startDate', 'endDate', 'assignment')
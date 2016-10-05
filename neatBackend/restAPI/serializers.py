import logging
from django.contrib.auth.models import *
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from rest_framework import serializers
from guardian.shortcuts import assign_perm
from .models import *

logger = logging.getLogger(__name__)


class ProfileSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Profile
        fields = ('url', 'grade', 'age', 'gender')

class GroupSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Group
        fields = ('url', 'name')

class UserSerializer(serializers.HyperlinkedModelSerializer):
    profile = ProfileSerializer(required=False)
    username = serializers.CharField(required=False)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('url', 'pk', 'username', 'password', 'first_name', 'last_name', 'email', 'groups', 'profile')

    def create(self, validated_data):
        
        un = validated_data.pop('username')
        em = validated_data.pop('email')
        pw = validated_data.pop('password')
        fn = validated_data.pop('first_name')
        ln = validated_data.pop('last_name')
        gr = validated_data.get('groups')
        profile_data = validated_data.pop('profile')
        user = User.objects.create_user(un, em, pw)
        user.first_name = fn
        user.last_name = ln
        user.group = gr
        user.save()
        Profile.objects.create(user=user, **profile_data)
        return user

    def update(self, instance, validated_data):
        pw = validated_data.get('password')
        instance.set_password(pw)
        instance.save()
        return instance

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
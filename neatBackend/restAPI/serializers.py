import logging
from django.contrib.auth.models import *
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from rest_framework import serializers
from guardian.shortcuts import assign_perm
from .models import *
#email verification
import hashlib, random

logger = logging.getLogger(__name__)

class SchoolSerializer(serializers.HyperlinkedModelSerializer):

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

class ProfileSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Profile
        fields = ('url', 'grade', 'age', 'gender', 'verified', 'emailCode', 'passwordCode')

class GroupSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Group
        fields = ('url', 'name')
        #Remove name validator so that UserSerializer works
        extra_kwargs = {
            'name': {'validators': []}
        }


class UserSerializer(serializers.HyperlinkedModelSerializer):
    groups = GroupSerializer(many=True, required=False)
    profile = ProfileSerializer(required=False)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('url', 'email', 'password', 'first_name', 'last_name', 'groups', 'profile')

    def create(self, validated_data):
        
        #grab data
        em = validated_data.pop('email')
        pw = validated_data.pop('password')
        fn = validated_data.pop('first_name')
        ln = validated_data.pop('last_name')
        group_data = validated_data.pop('groups')
        profile_data = validated_data.get('profile')

        #create new user
        user = User.objects.create_user(username=em, email=em, password=pw)
        user.first_name = fn
        user.last_name = ln
        user.save()

        #assign groups to user
        for group in group_data:
            g = Group.objects.get(name = group['name'])
            g.user_set.add(user)

        #link new profile to user
        if (profile_data is not None):
            Profile.objects.create(user=user, **profile_data)
        else:
            Profile.objects.create(user=user)

        return user

    def update(self, instance, validated_data):
        pw = validated_data.get('password')
        instance.set_password(pw)
        instance.save()
        return instance

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



class TaskSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Task
        fields = ('url', 'assignment', 'user', 'taskName', 'isDone', 'hoursPlanned', 'hoursCompleted', 'startDate', 'endDate')

class AssignmentSerializer(serializers.HyperlinkedModelSerializer):
    tasks = TaskSerializer(many=True, required=False, read_only=True)

    class Meta:
        model = Assignment
        fields = ('url', 'assignmentName', 'startDate', 'dueDate', 'classFK', 'tasks')


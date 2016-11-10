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
        fields = ('url', 'pk', 'schoolName', 'schoolID',)

    def create(self, validated_data):
        usr = self.context['request'].user
        school = School.objects.create(**validated_data)
        assign_perm('view_school', usr, school)
        assign_perm('change_school', usr, school)
        assign_perm('delete_school', usr, school)
        #Add user to school roster automatically
        schRoster = SchoolRoster.objects.create(user=usr, school=school)
        assign_perm('view_schoolroster', usr, schRoster)
        assign_perm('change_schoolroster', usr, schRoster)
        assign_perm('delete_schoolroster', usr, schRoster)
        return school

class ProfileSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Profile
        fields = ('url', 'pk', 'grade', 'age', 'gender', 'verified', 'emailCode', 'passwordCode')

class GroupSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Group
        fields = ('url', 'pk', 'name')
        #Remove name validator so that UserSerializer works
        extra_kwargs = {
            'name': {'validators': []}
        }

class SimpleUserSerializer(serializers.HyperlinkedModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('url', 'pk', 'email', 'password')

class UserSerializer(serializers.HyperlinkedModelSerializer):
    groups = GroupSerializer(many=True, required=False)
    profile = ProfileSerializer(required=False)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('url', 'pk', 'email', 'password', 'first_name', 'last_name', 'groups', 'profile')

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

"""
    def update(self, instance, validated_data):
        pw = validated_data.get('password')
        instance.set_password(pw)
        instance.save()
        return instance
"""

class SchoolRosterSerializer(serializers.HyperlinkedModelSerializer):
    user = serializers.HyperlinkedRelatedField(
        read_only=True,
        view_name='user-detail'
    )

    class Meta:
        model = SchoolRoster
        fields = ('url', 'pk', 'schoolYear', 'school', 'user')

    def create(self, validated_data):
        usr = self.context['request'].user
        schRoster = SchoolRoster.objects.create(user=usr, **validated_data)
        assign_perm('view_schoolroster', usr, schRoster)
        assign_perm('change_schoolroster', usr, schRoster)
        assign_perm('delete_schoolroster', usr, schRoster)
        return schRoster

class ClassSerializer(serializers.HyperlinkedModelSerializer):
    #roster = serializers.StringRelatedField(many=True, required=False)

    class Meta:
        model = Class
        fields = ('url', 'pk', 'className', 'classID', 'school', 'isPublic')

    def create(self, validated_data):
        usr = self.context['request'].user
        clss = Class.objects.create(**validated_data)
        assign_perm('view_class', usr, clss)
        assign_perm('change_class', usr, clss)
        assign_perm('delete_class', usr, clss)
        #Add user to class roster automatically
        clsRoster = ClassRoster.objects.create(user=usr, classFK=clss)
        assign_perm('view_classroster', usr, clsRoster)
        assign_perm('change_classroster', usr, clsRoster)
        assign_perm('delete_classroster', usr, clsRoster)
        return clss


class ClassRosterSerializer(serializers.HyperlinkedModelSerializer):
    user = serializers.HyperlinkedRelatedField(
        read_only=True,
        view_name='user-detail'
    )

    class Meta:
        model = ClassRoster
        fields = ('url', 'pk', 'classFK', 'user')

    def create(self, validated_data):
        usr = self.context['request'].user
        clsRoster = ClassRoster.objects.create(user=usr, **validated_data)
        assign_perm('view_classroster', usr, clsRoster)
        assign_perm('change_classroster', usr, clsRoster)
        assign_perm('delete_classroster', usr, clsRoster)
        return clsRoster



class TaskSerializer(serializers.HyperlinkedModelSerializer):
    user = serializers.HyperlinkedRelatedField(
        read_only=True,
        view_name='user-detail'
    )
    isApproved = serializers.BooleanField(read_only=True)

    class Meta:
        model = Task
        fields = ('url', 'pk', 'assignment', 'user', 'taskName', 'isDone', 'hoursPlanned', 'hoursCompleted', 'startDate', 'endDate', 'isApproved', 'dueDate', 'difficulty')

    def create(self, validated_data):
        usr = self.context['request'].user
        task = Task.objects.create(user=usr, **validated_data)
        assign_perm('view_task', usr, task)
        assign_perm('change_task', usr, task)
        assign_perm('delete_task', usr, task)
        return task

class AssignmentSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Assignment
        fields = ('url', 'pk', 'assignmentName', 'startDate', 'dueDate', 'classFK', 'isPublic')

    def create(self, validated_data):
        usr = self.context['request'].user
        assig = Assignment.objects.create(**validated_data)
        assign_perm('view_assignment', usr, assig)
        assign_perm('change_assignment', usr, assig)
        assign_perm('delete_assignment', usr, assig)
        #Add user to assignment roster automatically
        assgRoster = AssignmentRoster.objects.create(user=usr, assignment=assig)
        assign_perm('view_assignmentroster', usr, assgRoster)
        assign_perm('change_assignmentroster', usr, assgRoster)
        assign_perm('delete_assignmentroster', usr, assgRoster)
        return assig

class DashboardSerializer(serializers.HyperlinkedModelSerializer):
    tasks = serializers.SerializerMethodField()

    class Meta:
        model = Assignment
        fields = ('url', 'pk', 'assignmentName', 'startDate', 'dueDate', 'classFK', 'isPublic', 'tasks')
    
    #Get only tasks that belong to the user & given assignment
    def get_tasks(self, obj):
        tasks =  Task.objects.filter(user=self.context['request'].user).filter(assignment=obj)
        serializer = TaskSerializer(instance=tasks, many=True, context={'request': self.context['request']})
        return serializer.data

class AssignmentRosterSerializer(serializers.HyperlinkedModelSerializer):
    user = serializers.HyperlinkedRelatedField(
        read_only=True,
        view_name='user-detail'
    )
    class Meta:
        model = AssignmentRoster
        fields = ('url', 'pk', 'assignment', 'user')

    def create(self, validated_data):
        usr = self.context['request'].user
        assgRoster = AssignmentRoster.objects.create(user=usr, **validated_data)
        assign_perm('view_assignmentroster', usr, assgRoster)
        assign_perm('change_assignmentroster', usr, assgRoster)
        assign_perm('delete_assignmentroster', usr, assgRoster)
        return assgRoster
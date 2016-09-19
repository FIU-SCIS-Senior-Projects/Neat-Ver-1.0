from django.contrib.auth.models import User, Group
from rest_framework import serializers

from restAPI.models import School, SchoolRoster, Class, UserInfo, ClassRoster, Assignment, Task


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups')


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')


class AuthSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')


class SchoolSerializer(serializers.HyperlinkedModelSerializer):
    schoolRosters = serializers.StringRelatedField(many=True)
    classes = serializers.StringRelatedField(many=True)

    class Meta:
        model = School
        fields = ('url', 'schoolName', 'schoolID', 'schoolRosters', 'classes',)


class SchoolRosterSerializer(serializers.HyperlinkedModelSerializer):
    userInfos = serializers.StringRelatedField(many=True)

    class Meta:
        model = SchoolRoster
        fields = ('url', 'schoolYear', "school", "userInfos",)

# TODO: Check the url for user, how to get the user to connect to userinfo
class UserInfoSerializer(serializers.HyperlinkedModelSerializer):
    url = serializers.CharField(source='user.url')
    username = serializers.CharField(source='user.username')
    email = serializers.CharField(source='user.email')

    class Meta:
        model = UserInfo
        fields = ('grade', 'age', 'gender',
                  'url', 'username', 'email',)


class ClassSerializer(serializers.HyperlinkedModelSerializer):
    classRosters = serializers.StringRelatedField(many=True)

    class Meta:
        model = Class
        fields = ('url','className', 'classID', 'school', 'classRosters',)


class ClassRosterSeriazlier(serializers.HyperlinkedModelSerializer):

 userinfos = UserInfoSerializer(many=True, read_only=True)

 class Meta:
     model = ClassRoster
     fields = ('url', 'classFK', 'userinfos',)


class AssignmentSerializer(serializers.HyperlinkedModelSerializer):
    tasks = serializers.StringRelatedField(many=True)

    class Meta:
        model = Assignment
        fields = ('url', 'startDate', 'dueDate', 'classFK', 'userInfo', 'tasks')


class TaskSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Task
        fields = ('url', 'taskName', 'isDone', 'hoursPlanned', 'hoursCompleted', 'startDate', 'endDate', 'assignment',)
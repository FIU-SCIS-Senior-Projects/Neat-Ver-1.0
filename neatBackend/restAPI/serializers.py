from django.contrib.auth.models import User
from rest_framework import serializers

from restAPI.models import School, SchoolRoster, Class, UserInfo, ClassRoster, Assignment, Task


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'password',)

#TODO: add schoolRoster such that it doesn't mess with register
class UserInfoSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = UserInfo
        fields = ('url', 'grade', 'age', 'gender', 'schoolRoster')


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


class ClassSerializer(serializers.HyperlinkedModelSerializer):
    classRosters = serializers.StringRelatedField(many=True)

    class Meta:
        model = Class
        fields = ('url','className', 'classID', 'school', 'classRosters',)


class ClassRosterSeriazlier(serializers.HyperlinkedModelSerializer):

 userInfos = UserInfoSerializer(many=True, read_only=True, source='userInfo')

 class Meta:
     model = ClassRoster
     fields = ('url', 'classFK', 'userInfos',)


class AssignmentSerializer(serializers.HyperlinkedModelSerializer):
    tasks = serializers.StringRelatedField(many=True)

    class Meta:
        model = Assignment
        fields = ('url', 'assignmentName', 'startDate', 'dueDate', 'classFK', 'userInfo', 'tasks')


class TaskSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Task
        fields = ('url', 'taskName', 'isDone', 'hoursPlanned', 'hoursCompleted', 'startDate', 'endDate', 'assignment',)
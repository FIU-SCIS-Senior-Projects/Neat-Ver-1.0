import datetime
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

"""
Models are based off Database UML diagram found in the documentation
Users, Permissions and Groups are predefined Django authorization models

for CharFields max_length was often chosen as 255 because these fields do not need to go beyond that. Although, the
current database allows for longer fields, if in the future a change occurs this decision defends against problems
if such a decision arises.
"""
# TODO : since we may not want to delete any/some entries when a user opts out we may want to add a field to check if user opted out instead of cascading deletes.
# TODO : should ClassRoster also have year?


class School(models.Model):
    schoolName = models.CharField(max_length=255)
    schoolID = models.CharField(max_length=255) # TODO: What does a school ID actually look like? Is it unique even across school districts?


class SchoolRoster(models.Model):
    schoolYear = models.PositiveSmallIntegerField(default = timezone.now().year) # TODO: how do we want to define school year?
    school = models.ForeignKey(School, on_delete=models.CASCADE)


class UserInfo(models.Model):
    grade = models.PositiveSmallIntegerField()
    age = models.PositiveSmallIntegerField()
    gender = models.CharField(max_length=50)
    schoolRoster = models.ForeignKey(SchoolRoster, on_delete=models.PROTECT) # TODO : Do we want a user to be deleted from the DB if they leave the service? Right now, it's not allowed.
    user = models.OneToOneField(User, on_delete=models.PROTECT) # TODO : Do we want a user to be deleted from the DB if they leave the service? Right now, it's not allowed.

    def __str__(self):
        return "User Info: \nGrade:"  + str(self.grade) + "\nAge: " + str(self.age) + "\nGender: " + self.gender \
               + "\nUser: " + str(self.user)


class Class(models.Model):
    className = models.CharField(max_length=255)
    classID = models.CharField(max_length=255) # TODO: What does a class ID look like? This can have great variance, so charfield was chosen.
    school = models.ForeignKey(School, on_delete=models.CASCADE)


class ClassRoster(models.Model):
    classFK = models.ForeignKey(Class, on_delete=models.CASCADE)
    userInfo = models.ManyToManyField(UserInfo)


class Assignment(models.Model):
    assignmentName = models.CharField(max_length=255)
    duedate = models.DateField()
    classFK = models.ForeignKey(Class, on_delete=models.CASCADE)
    userInfo = models.ForeignKey(UserInfo, on_delete=models.CASCADE)


class Task(models.Model):
    taskName = models.CharField(max_length=255)
    isDone = models.BooleanField(default=False)
    startDate = models.DateField(auto_now_add=True) # Start date is set to day of creation
    endDate = models.DateField()
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE)

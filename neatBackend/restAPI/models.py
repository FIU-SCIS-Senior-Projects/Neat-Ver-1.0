import datetime

from django.core.exceptions import ValidationError
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

"""
Models are based off Database UML diagram found in the documentation
Users, Permissions and Groups are predefined Django authorization models

IMPORTANT: when inputting into database programmer should run a ClassName.clean() on the model.
to do data validation.

for CharFields max_length was often chosen as 255 because these fields do not need to go beyond that. Although, the
current database allows for longer fields, if in the future a change occurs this decision defends against problems
if such a decision arises.
"""
# TODO : since we may not want to delete any/some entries when a user opts out we may want to add a field to check if user opted out instead of cascading deletes.
# TODO : should ClassRoster also have year?
# TODO : test_models run validations, but endpoints do not


def is_before_today(value):
    if value == datetime.date.today():
        return False
    elif value < datetime.date.today():
        return True
    else:  # value greater than and not equal to
        return False


def date_error_string(value):
        return "Inputted date of {!s} cannot be before today's date of {!s}".format(value, datetime.date.today())

class School(models.Model):
    #fields
    schoolName = models.CharField(max_length=255)
    schoolID = models.CharField(max_length=255) # TODO: What does a school ID actually look like? Is it unique even across school districts?

    #permissions
    class Meta:
        unique_together = ('schoolName', 'schoolID',)

        #add, change, delete already exist by default
        permissions = (
            ('view_school', 'View school'),
        )

    def __str__(self):
        return self.schoolName


class SchoolRoster(models.Model):
    #FK
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='roster')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='enrolledSchools')

    #fields
    schoolYear = models.PositiveSmallIntegerField(default = timezone.now().year) # TODO: how do we want to define school year?
    
    def clean(self):
        if self.schoolYear < 2016:  # start year of the app
            self.schoolYear = timezone.now().year
            raise ValidationError("School Roster year set too early. Changed to this year")

    def __str__(self):
        return str(self.school) + " year " + str(self.schoolYear)


class Class(models.Model):
    #FK
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='classes')

    #fields
    className = models.CharField(max_length=255)
    classID = models.CharField(max_length=255) # TODO: What does a class ID look like? This can have great variance, so charfield was chosen.

    #permissions
    #permissions
    class Meta:
        unique_together = ('school', 'classID',)

        #add, change, delete already exist by default
        permissions = (
            ('view_class', 'View classes'),
        )

    def __str__(self):
        return self.className + " at " + str(self.school)


class ClassRoster(models.Model):
    #FK
    classFK = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='roster')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='enrolledClasses')


class Assignment(models.Model):
    #FK
    classFK = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='assignments')

    #fields
    assignmentName = models.CharField(max_length=255)
    startDate = models.DateField(default=datetime.date.today()) # Start date is set to day of creation
    dueDate = models.DateField(validators=[is_before_today], null=True)
    
    #permissions
    class Meta:

        #add, change, delete already exist by default
        permissions = (
            ('view_assignment', 'View assignments'),
        )

    def clean(self):
        errors = {}
        if is_before_today(self.dueDate):
            errors['dueDate'] = ValidationError(date_error_string(self.dueDate))
            self.dueDate = None  # If not a valid date, sets to None
        if is_before_today(self.startDate):
            errors['startDate'] = ValidationError(date_error_string(self.startDate))
            self.startDate = None  # If not a valid date, sets to None
        if errors:
            raise ValidationError(errors)

    def __str__(self):
        return self.assignmentName


class Task(models.Model):
    #FK
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='tasks')

    #fields
    taskName = models.CharField(max_length=255)
    isDone = models.BooleanField(default=False)
    hoursPlanned = models.PositiveSmallIntegerField(null=True)
    hoursCompleted = models.PositiveSmallIntegerField(null=True)
    startDate = models.DateField(default=datetime.date.today()) # Start date is set to day of creation
    endDate = models.DateField(validators=[is_before_today], null=True)
    
    #permissions
    class Meta:

        #add, change, delete already exist by default
        permissions = (
            ('view_task', 'View tasks'),
        )

    def clean(self):
        errors = {}
        if is_before_today(self.endDate):
            errors['endDate'] = ValidationError(date_error_string(self.endDate))
            self.endDate = None  # If not a valid date, sets to None
        if is_before_today(self.startDate):
            errors['startDate'] = ValidationError(date_error_string(self.startDate))
            self.startDate = None  # If not a valid date, sets to None
        if self.hoursPlanned is not None and self.hoursPlanned <= 0:
            errors['hoursPlanned'] = ValidationError("hoursPlanned cannot be non-positive. Set to 1")
            self.hoursPlanned = 1
        if self.hoursCompleted is not None and self.hoursCompleted <= 0:
            errors['hoursCompleted'] = ValidationError("hoursCompleted cannot be non-positive. Set to 1")
            self.hoursCompleted = 1
        if errors:
            raise ValidationError(errors)

    def __str__(self):
        return self.taskName

class Profile(models.Model):
    #FK
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    school = models.ForeignKey(School, on_delete=models.PROTECT, related_name='users', null=True) # TODO : Do we want a user to be deleted from the DB if they leave the service? Right now, it's not allowed.

    #fields
    grade = models.PositiveSmallIntegerField(null=True)
    age = models.PositiveSmallIntegerField(null=True)
    gender = models.CharField(max_length=50, null=True)
    
    #email verification
    verified = models.BooleanField(default=False)
    emailCode = models.CharField(max_length=40, null=True)
    #keyExpiration = models.DateTimeField(null=True)

    passwordCode = models.CharField(max_length=40, null=True)

    class Meta:
        unique_together = ('user', 'school',)

    def __str__(self):
        return "User Info: \nGrade:"  + str(self.grade) + "\nAge: " + str(self.age) + "\nGender: " + self.gender \
               + "\nUser: " + "" if self.user is None else str(self.user)


from datetime import date, timedelta

from django.core.exceptions import ValidationError
from django.test import TestCase

from restAPI.models import Assignment, Task


class DateFieldModelValidation(TestCase):
    today = date.today()
    beforeToday = today + timedelta(days=-3)
    afterToday = today + timedelta(days=+3)

    def test_assignment_default_startdate_not_before_today(self):
        """
            Check that the default startdate cannot be before today. startDate
            has a default value of today if none is placed.
        """
        assignment = Assignment()
        self.assertGreaterEqual(assignment.startDate, self.today)

    def test_assignment_startdate_not_before_today(self):
        """
            Check that the inputted startdate cannot be before today.
        """
        assignment = Assignment(startDate= self.beforeToday, dueDate=self.afterToday)
        try:
            assignment.clean()
        except ValidationError as e:
            print (e.message_dict)
        self.assertIsNone(assignment.startDate)

    def test_assignment_duedate_not_before_today(self):
        """
            Check that the inputted duedate cannot be before today.
        """
        assignment = Assignment(dueDate= self.beforeToday)
        try:
            assignment.clean()
        except ValidationError as e:
            print (e.message_dict)
        self.assertIsNone(assignment.dueDate)

    def test_task_default_startdate_not_before_today(self):
        """
            Check that the default startdate cannot be before today. startDate
            has a default value of today if none is placed.
        """
        task = Task()
        self.assertGreaterEqual(task.startDate, self.today)

    def test_task_startdate_not_before_today(self):
        """
            Check that the inputted startdate cannot be before today.
        """
        task = Task(startDate= self.beforeToday, endDate=self.afterToday)
        try:
            task.clean()
        except ValidationError as e:
            print (e.message_dict)
        self.assertIsNone(task.startDate)

    def test_task_duedate_not_before_today(self):
        """
            Check that the inputted duedate cannot be before today.
        """
        task = Task(endDate= self.beforeToday)
        try:
            task.clean()
        except ValidationError as e:
            print (e.message_dict)
        self.assertIsNone(task.endDate)

import logging
from datetime import date, timedelta

from django.core.exceptions import ValidationError
from django.test import TestCase
from django.utils import timezone

from restAPI.models import Assignment, Task, SchoolRoster

logger = logging.getLogger(__name__)

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
            logger.debug(e.message_dict)
        self.assertIsNone(assignment.startDate)

    def test_assignment_duedate_not_before_today(self):
        """
            Check that the inputted duedate cannot be before today.
        """
        assignment = Assignment(dueDate= self.beforeToday)
        try:
            assignment.clean()
        except ValidationError as e:
            logger.debug(e.message_dict)
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
        task = Task(startDate= self.beforeToday, endDate=self.afterToday, hoursPlanned=1)
        try:
            task.clean()
        except ValidationError as e:
            logger.debug(e.message_dict)
        self.assertIsNone(task.startDate)

    def test_task_duedate_not_before_today(self):
        """
            Check that the inputted duedate cannot be before today.
        """
        task = Task(endDate= self.beforeToday, hoursPlanned=1)
        try:
            task.clean()
        except ValidationError as e:
            logger.debug(e.message_dict)
        self.assertIsNone(task.endDate)


class PositiveValueModelTests(TestCase):
    today = date.today()
    beforeToday = today + timedelta(days=-3)
    afterToday = today + timedelta(days=+3)

    def test_schoolyear_is_positive(self):
        schoolRoster = SchoolRoster(schoolYear = -2016)
        try:
            schoolRoster.clean()
        except ValidationError as e:
            logger.debug(e.message)
        self.assertGreater(schoolRoster.schoolYear, 0)

    def test_school_year_default_is_positive(self):
        schoolRoster = SchoolRoster()
        schoolRoster.clean()
        self.assertEqual(schoolRoster.schoolYear, timezone.now().year)

    def test_hoursPlanned_is_positive(self):
        task = Task(endDate= self.afterToday, hoursPlanned=-2)
        try:
            task.clean()
        except ValidationError as e:
            logger.debug(e.message_dict)
        self.assertGreater(task.hoursPlanned, 0)

    def test_hoursCompleted_is_positive(self):
        task = Task(endDate=self.afterToday, hoursCompleted=-2)
        try:
            task.clean()
        except ValidationError as e:
            logger.debug(e.message_dict)
        self.assertGreater(task.hoursCompleted, 0)
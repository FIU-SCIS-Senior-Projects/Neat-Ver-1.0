from datetime import date, timedelta

from django.contrib.auth.models import User

from rest_framework import status
from rest_framework.reverse import reverse, reverse_lazy

from rest_framework.test import APIClient, APITestCase

"""
setUpTestData makes it so that initial data is created once and run for class. This is not supported on DB's without
 transaction support. MySQL is one, but it's left here in case this changes in the future.
"""


class LoginTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.client = APIClient()
        cls.user = User.objects.create_superuser('Bruce', 'bruce@wayne.com', 'batman')
        cls.client.login(username='bruce', password='batman')

    def test_login_is_OK_with_superuser(self):
        """  Test login returns HTTP Code 200 for a superuser """
        response = self.client.post('/login/', {'username': 'Bruce', 'password': 'batman'}, format='json')
        self.assertEquals(response.status_code, status.HTTP_200_OK)

    def test_login_is_not_OK_with_nonuser(self):
        """ Test login returns HTTP Code 401 on nonuser """
        response = self.client.post('/login/', {'username': 'Clark', 'password': 'superman'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class UserTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.client = APIClient()
        cls.superuser = User.objects.create_superuser('Bruce', 'bruce@wayne.com', 'batman')
        cls.client.login(username='bruce', password='batman')
        cls.data = {'username': 'TheFlash', 'email': 'barryA@dc.com', 'password': 'TooFast',
                "userInfo": {"age": 9, "gender": "male", "grade": 4}}

    def test_user_can_be_created(self):
        """ Test that a user can be registered """
        url = reverse('register-list')
        response = self.client.post(url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_can_be_read(self):
        """ Test that userInfo can be fetched """
        url = reverse('register-list')
        response = self.client.post(url, self.data, format='json')
        url = reverse('user-detail', args=[response.data.get('userPK')])
        response = self.client.get(url, data = {'username': 'TheFlash', 'email': 'barryA@dc.com'})
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        response.data.pop('password') # password comes back hashed, as it should. Pop out for assertionEqual
        response.data.pop('userInfo') # userInfo returns a url, as it should. Our data is in json, it will not be equal.
        response.data.pop('url') # serializer creates a url field, not in original json data
        testData = self.data.copy()
        testData.pop('password')
        testData.pop('userInfo')
        self.assertEquals(response.data, testData)

    def test_user_email_and_username_field_can_be_changed(self):
        """ Test that email and username can be updated """
        url = reverse('register-list')
        response = self.client.post(url, self.data, format='json')
        url = reverse('user-detail', args=[response.data.get('userPK')])
        response = self.client.get(url)
        getData = response.data
        getData.update(email= 'BAlle023@dc.com', username= 'CrimsonStreak', )
        response = self.client.put(url, getData, format='json')
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        response.data.pop('password') # password comes back hashed, as it should. Pop out for assertionEqual
        response.data.pop('userInfo') # userInfo returns a url, as it should. Our data is in json, it will not be equal.
        response.data.pop('url') # serializer creates a url field, not in original json data
        testData = self.data.copy()
        testData.update(email= 'BAlle023@dc.com', username= 'CrimsonStreak')
        testData.pop('password')
        testData.pop('userInfo')
        self.assertEquals(response.data, testData)

    # TODO: Test that a password can be changed


class UserInfoTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.client = APIClient()
        cls.superuser = User.objects.create_superuser('Bruce', 'bruce@wayne.com', 'batman')
        cls.client.login(username='bruce', password='batman')
        cls.data = {'username': 'TheFlash', 'email': 'barryA@dc.com', 'password': 'TooFast',
                           "userInfo": {"age": 9, "gender": "male", "grade": 4}}

    def test_userInfo_created_and_gotten_successfully(self):
        """ Test that userInfo can be created during register and gotten from DB """
        url = reverse('register-list')
        response = self.client.post(url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        url = reverse('user-detail', args=[response.data.get('userPK')])
        response = self.client.get(url)
        response = self.client.get(response.data.get('userInfo'))
        response.data.pop('schoolRoster')
        response.data.pop('url')
        testData = self.data.copy()
        testData = testData.pop('userInfo')
        self.assertEquals(response.data, testData)

    def test_userInfo_fields_can_be_changed(self):
        """ Test that userInfo fields can be changed """
        url = reverse('register-list')
        response = self.client.post(url, self.data, format='json')
        url = reverse('user-detail', args=[response.data.get('userPK')])
        response = self.client.get(url)
        response = self.client.get(response.data.get('userInfo'))
        getData = response.data
        getData.update(grade= 5, age=10, gender=None)
        response = self.client.put(response.data.get('url'), getData, format='json')
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        self.assertEquals(response.data, getData)


class SchoolTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.client = APIClient()
        cls.superuser = User.objects.create_superuser('Bruce', 'bruce@wayne.com', 'batman')
        cls.client.login(username='bruce', password='batman')
        cls.data = {'schoolName': 'JusticeLeagueHeadquarters', 'schoolID': 'DoJ123',}

    def test_school_created_and_gotten_successfully(self):
        url = reverse('school-list')
        response = self.client.post(url, self.data, format='json')
        self.assertEquals(response.status_code, status.HTTP_201_CREATED)
        response.data.pop('url') # serializer creates a url field, not in original json data
        response.data.pop('schoolRosters') # Schools have no rosters when they are created
        response.data.pop('classes') # Schools have no classes when they are created
        self.assertEquals(response.data, self.data)

    def test_school_fields_can_be_changed(self):
        url = reverse('school-list')
        response = self.client.post(url, self.data, format='json')
        url = response.data.get('url')
        getData = response.data
        getData.update(schoolName= 'Gotham High', schoolID='GCSC111')
        response = self.client.put(url, getData)
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        self.assertEquals(response.data, getData)


class SchoolRosterTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.client = APIClient()
        cls.superuser = User.objects.create_superuser('Bruce', 'bruce@wayne.com', 'batman')
        cls.client.login(username='bruce', password='batman')
        cls.schoolUrl = reverse('school-list')
        cls.schoolData = {'schoolName': 'JusticeLeagueHeadquarters', 'schoolID': 'DoJ123',}
        cls.schoolResponse = cls.client.post(cls.schoolUrl, cls.schoolData, format='json')
        cls.data = {'schoolYear': 2016, 'school': cls.schoolResponse.data.get('url')}

    def test_schoolRoster_created_and_gotten_successfully(self):
        url = reverse('schoolroster-list')
        response = self.client.post(url, self.data)
        self.assertEquals(response.status_code, status.HTTP_201_CREATED)
        url = response.data.get('url')
        response = self.client.get(url)
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        response.data.pop('url')
        response.data.pop('userInfos') # userInfos can be null at creation, pop out for assertion test.
        self.assertEquals(response.data, self.data)

    def test_schoolRoster_fields_can_be_changed(self):
        url = reverse('schoolroster-list')
        response = self.client.post(url, self.data)
        url = response.data.get('url')
        getData = response.data
        getData.update(schoolYear= 2017,)
        response = self.client.put(url, getData)
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        self.assertEquals(response.data, getData)


class ClassTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.client = APIClient()
        cls.superuser = User.objects.create_superuser('Bruce', 'bruce@wayne.com', 'batman')
        cls.client.login(username='bruce', password='batman')
        cls.schoolUrl = reverse('school-list')
        cls.schoolData = {'schoolName': 'JusticeLeagueHeadquarters', 'schoolID': 'DoJ123',}
        cls.schoolResponse = cls.client.post(cls.schoolUrl, cls.schoolData, format='json')
        cls.data = {'className': 'Intro to SuperHeroing', 'classID': 'SH101',
                    'school': cls.schoolResponse.data.get('url')}

    def test_class_created_and_gotten_successfully(self):
        url = reverse('class-list')
        response = self.client.post(url, self.data)
        self.assertEquals(response.status_code, status.HTTP_201_CREATED)
        url = response.data.get('url')
        response = self.client.get(url)
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        response.data.pop('url')
        response.data.pop('classRosters') # classRosters can be null at creation, pop out for assertion test.
        self.assertEquals(response.data, self.data)

    def test_class_fields_can_be_changed(self):
        url = reverse('class-list')
        response = self.client.post(url, self.data)
        url = response.data.get('url')
        getData = response.data
        getData.update(className= 'Intro to Flying', classID= 'MECH105')
        response = self.client.put(url, getData)
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        self.assertEquals(response.data, getData)


class ClassRosterTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.client = APIClient()
        cls.superuser = User.objects.create_superuser('Bruce', 'bruce@wayne.com', 'batman')
        cls.client.login(username='bruce', password='batman')
        cls.schoolUrl = reverse('school-list')
        cls.schoolData = {'schoolName': 'JusticeLeagueHeadquarters', 'schoolID': 'DoJ123',}
        cls.schoolResponse = cls.client.post(cls.schoolUrl, cls.schoolData, format='json')
        cls.classData = {'className': 'Intro to SuperHeroing', 'classID': 'SH101',
                    'school': cls.schoolResponse.data.get('url')}
        cls.classUrl = reverse('class-list')
        cls.classResponse = cls.client.post(cls.classUrl, cls.classData, format='json')
        cls.data = {'classFK': cls.classResponse.data.get('url'), 'userInfos' : []}

    def test_classRoster_created_and_gotten_successfully(self):
        url = reverse('classroster-list')
        response = self.client.post(url, self.data)
        self.assertEquals(response.status_code, status.HTTP_201_CREATED)
        url = response.data.get('url')
        response = self.client.get(url)
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        response.data.pop('url')
        self.assertEquals(response.data, self.data)


class AssignmentTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        """
        Must set up by creating a school, so a class can exist which is required by assignment.
        userInfo also required, so a user needs to be registered.
        """
        cls.client = APIClient()
        cls.superuser = User.objects.create_superuser('Bruce', 'bruce@wayne.com', 'batman')
        cls.client.login(username='bruce', password='batman')
        cls.schoolUrl = reverse('school-list')
        cls.schoolData = {'schoolName': 'JusticeLeagueHeadquarters', 'schoolID': 'DoJ123',}
        cls.schoolResponse = cls.client.post(cls.schoolUrl, cls.schoolData, format='json')
        cls.classData = {'className': 'Intro to SuperHeroing', 'classID': 'SH101',
                    'school': cls.schoolResponse.data.get('url')}
        cls.classUrl = reverse('class-list')
        cls.classResponse = cls.client.post(cls.classUrl, cls.classData, format='json')
        cls.userData = {'username': 'TheFlash', 'email': 'barryA@dc.com', 'password': 'TooFast',
                           "userInfo": {"age": 9, "gender": "male", "grade": 4}}
        cls.registerUrl = reverse('register-list')
        cls.registerResponse = cls.client.post(cls.registerUrl, cls.userData, format='json')
        cls.userUrl = reverse('user-detail', args=[cls.registerResponse.data.pop('userPK')])
        cls.userResponse = cls.client.get(cls.userUrl)
        cls.today = date.today()
        cls.afterToday = date.today() + timedelta(days=+3)
        cls.data = {'classFK': cls.classResponse.data.get('url'), 'userInfo': cls.userResponse.data.get('userInfo'),
                    'assignmentName': "Be the Fastest", "startDate": cls.today,
                    "dueDate": cls.afterToday}

    def test_assignment_created_and_gotten_successfully(self):
        url = reverse('assignment-list')
        response = self.client.post(url, self.data)
        self.assertEquals(response.status_code, status.HTTP_201_CREATED)
        url = response.data.get('url')
        response = self.client.get(url)
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        response.data.pop('url')
        response.data.pop('tasks')  # tasks can be null at creation, pop out for assertion test
        testData = self.data.copy()
        testData.update(startDate= str(self.today), dueDate= str(self.afterToday))
        self.assertEquals(response.data, testData)

    def test_assignment_fields_can_be_changed(self):
        url = reverse('assignment-list')
        response = self.client.post(url, self.data)
        url = response.data.get('url')
        getData = response.data
        newDueDate = self.afterToday + timedelta(days=+10)
        getData.update(assignmentName= 'Time Travel', dueDate= newDueDate)
        response = self.client.put(url, getData)
        getData.update(dueDate= str(newDueDate))
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        self.assertEquals(response.data, getData)


class TaskTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        """
        Must set up by creating a school, so a class can exist which is required by assignment.
        userInfo also required, so a user needs to be registered.
        """
        cls.client = APIClient()
        cls.superuser = User.objects.create_superuser('Bruce', 'bruce@wayne.com', 'batman')
        cls.client.login(username='bruce', password='batman')
        cls.schoolUrl = reverse('school-list')
        cls.schoolData = {'schoolName': 'JusticeLeagueHeadquarters', 'schoolID': 'DoJ123',}
        cls.schoolResponse = cls.client.post(cls.schoolUrl, cls.schoolData, format='json')
        cls.classData = {'className': 'Intro to SuperHeroing', 'classID': 'SH101',
                    'school': cls.schoolResponse.data.get('url')}
        cls.classUrl = reverse('class-list')
        cls.classResponse = cls.client.post(cls.classUrl, cls.classData, format='json')
        cls.userData = {'username': 'TheFlash', 'email': 'barryA@dc.com', 'password': 'TooFast',
                           "userInfo": {"age": 9, "gender": "male", "grade": 4}}
        cls.registerUrl = reverse('register-list')
        cls.registerResponse = cls.client.post(cls.registerUrl, cls.userData, format='json')
        cls.userUrl = reverse('user-detail', args=[cls.registerResponse.data.pop('userPK')])
        cls.userResponse = cls.client.get(cls.userUrl)
        cls.today = date.today()
        cls.afterToday = date.today() + timedelta(days=+3)
        cls.assignmentData = {'classFK': cls.classResponse.data.get('url'), 'userInfo': cls.userResponse.data.get('userInfo'),
                    'assignmentName': "Be the Fastest", "startDate": cls.today,
                    "dueDate": cls.afterToday}
        cls.assignmentUrl = reverse('assignment-list')
        cls.assignmentResponse = cls.client.post(cls.assignmentUrl, cls.assignmentData, format='json')
        cls.data = {'assignment': cls.assignmentResponse.data.get('url'), 'isDone': False,
                    'taskName': "Practice on treadmill", 'hoursPlanned': 3, "startDate": cls.today, }

    def test_task_created_and_gotten_successfully(self):
        url = reverse('task-list')
        response = self.client.post(url, self.data)
        self.assertEquals(response.status_code, status.HTTP_201_CREATED)
        url = response.data.get('url')
        response = self.client.get(url)
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        response.data.pop('url')
        response.data.pop('hoursCompleted')  # hoursCompleted can be null at creation, pop out for assertion test
        response.data.pop('endDate')  # endDate can be null at creation, pop out for assertion test
        testData = self.data.copy()
        testData.update(startDate= str(self.today), )
        self.assertEquals(response.data, testData)

    def test_task_fields_can_be_changed(self):
        url = reverse('task-list')
        response = self.client.post(url, self.data)
        url = response.data.get('url')
        getData = response.data
        endDate = self.afterToday + timedelta(days=+10)
        getData.update(taskName= 'Time Travel is done', endDate= endDate, isDone=True, hoursCompleted=10)
        response = self.client.put(url, getData)
        getData.update(endDate = str(endDate)) # endDate string placed for comparison.
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        self.assertEquals(response.data, getData)












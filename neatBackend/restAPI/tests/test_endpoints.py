from django.contrib.auth.models import User

from rest_framework import status
from rest_framework.reverse import reverse, reverse_lazy

from rest_framework.test import APIClient, APITestCase

"""
setUpTestData makes it so that initial data is created once and run for class. This is not supported on DB's without
 transaction support. MySQL is one, but it's left here in case this changes in the future.
"""


class ALoginTests(APITestCase):
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


class BUserTests(APITestCase):
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
        self.client.post(url, self.data, format='json')

        dummyurl = reverse('user-list')
        response = self.client.get(dummyurl)
        print("User list: " + str(response.data))

        url = reverse('user-detail', args=[4])
        response = self.client.get(url, data = {'username': 'TheFlash', 'email': 'barryA@dc.com'})
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        print("User list part 2: " + str(response.data))
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
        self.client.post(url, self.data, format='json')
        url = reverse('user-detail', args=[5])
        response = self.client.get(url)
        getData = response.data
        getData.update(email= 'BAlle023@dc.com', username= 'CrimsonStreak',
                                       userInfo= 'http://testserver/restapi/userinfos/3/')

        dummyurl = reverse('user-list')
        response = self.client.get(dummyurl)
        print("User list in emailchange: " + str(response.data))

        response = self.client.put(url, getData, format='json')
        print(response.rendered_content)
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


class CUserInfoTests(APITestCase):
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
        url = reverse('userinfo-detail', args=[4])
        response = self.client.get(url)
        print("userinfo response: " + str(response.data))
        response.data.pop('schoolRoster')
        response.data.pop('url')
        testData = self.data.copy()
        testData = testData.pop('userInfo')
        self.assertEquals(response.data, testData)

    def test_userInfo_fields_can_be_changed(self):
        """ Test that userInfo fields can be changed """
        url = reverse('register-list')
        response = self.client.post(url, self.data, format='json')
        url = reverse('user-list')
        response = self.client.get(url)
        print(response.data)
        url = reverse('userinfo-detail', args=[5])
        response = self.client.get(url)
        getData = response.data
        getData.update(grade= 5, age=10, gender=None)
        response = self.client.put(url, getData, format='json')
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        print(response.rendered_content)
        self.assertEquals(response.data, getData)


class DSchoolsTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.client = APIClient()
        cls.superuser = User.objects.create_superuser('Bruce', 'bruce@wayne.com', 'batman')
        cls.client.login(username='bruce', password='batman')
        cls.data = {'schoolName': 'JusticeLeagueHeadquarters', 'schoolID': 'DoJ123',}

    def test_school_created_and_gotten_successfully(self):
        url = reverse('school-list')
        response = self.client.post(url, self.data, format='json')
        print(response.data)
        self.assertEquals(response.status_code, status.HTTP_201_CREATED)
        response.data.pop('url') # serializer creates a url field, not in original json data
        response.data.pop('schoolRosters') # Schools have no rosters when they are created
        response.data.pop('classes') # Schools have no classes when they are created
        self.assertEquals(response.data, self.data)










from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status

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
        """
        Test that login returns HTTP Code 200 for a superuser
        """
        response = self.client.post('/login/', {'username': 'Bruce', 'password': 'batman'}, format='json')
        self.assertEquals(response.status_code, status.HTTP_200_OK)

    def test_login_is_not_OK_with_nonuser(self):
        """
        Test that login returns HTTP Code 401
        """
        response = self.client.post('/login/', {'username': 'Clark', 'password': 'superman'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class UserTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.client = APIClient()
        cls.user = User.objects.create_superuser('Bruce', 'bruce@wayne.com', 'batman')
        cls.client.login(username='bruce', password='batman')
        cls.user = User.objects.create(username='Barry')

    def test_user_can_be_created(self):
        data = {'username': 'TheFlash', 'first_name': 'Barry', 'last_name': 'Allen', 'password': 'TooFast',
                "userInfo": {"age": 9, "gender": "male", "grade": 4}}
        url = reverse('register-list')
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)






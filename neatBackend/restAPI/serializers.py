from django.contrib.auth.models import User
from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'password')

class RegisterSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def create(self, validated_data):
        usr = validated_data.get('username')
        eml = validated_data.get('email')
        psw = validated_data.get('password')
        user = User.objects.create_user(username=usr, email=eml, password=psw)
        return user

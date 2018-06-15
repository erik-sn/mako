from datetime import datetime
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User

from api.models import LoginRecord
from api.serializers import LoginRecordSerializer
from api.utils import get_client_ip


LOGIN_LIST_COUNT = 10


def parse_token_expirations(refresh_token: RefreshToken) -> (datetime, datetime):
    access = refresh_token.access_token
    return datetime.fromtimestamp(refresh_token.payload['exp']), datetime.fromtimestamp(access.payload['exp'])


def list_previous_logins(user):
    login_events = LoginRecord.objects.filter(user=user)[:LOGIN_LIST_COUNT]
    return LoginRecordSerializer(login_events, many=True).data


def create_login_event(json: dict, request) -> None:
    user = User.objects.get(username=json['username'])
    LoginRecord.objects.create(user=user, ip_address=get_client_ip(request), user_agent=request.META['HTTP_USER_AGENT'])
    json['login_records'] = list_previous_logins(user)


def retrieve_user_info(user):
    return {
        'username': user.username,
        'email': user.email,
        'date_joined': user.date_joined,
        'last_login': user.last_login,
        'is_superuser': user.is_superuser
    }


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super(MyTokenObtainPairSerializer, self).validate(attrs)

        if self.user:
            refresh_token = self.get_token(self.user)
            refresh_expiration, access_expiration = parse_token_expirations(refresh_token)
            data['access_expiration'] = access_expiration
            data['refresh_expiration'] = refresh_expiration
            data = {**data, **retrieve_user_info(self.user)}

        return data


class MyTokenRefreshSerializer(TokenRefreshSerializer):

    def validate(self, attrs):
        data = super(MyTokenRefreshSerializer, self).validate(attrs)
        refresh_token = RefreshToken(attrs['refresh'])
        refresh_expiration, access_expiration = parse_token_expirations(refresh_token)
        data['access_expiration'] = access_expiration
        data['refresh_expiration'] = refresh_expiration
        user = User.objects.get(id=refresh_token.payload['user_id'])
        if user:
            data = {**data, **retrieve_user_info(user)}

        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super(MyTokenObtainPairView, self).post(request, *args, **kwargs)
        create_login_event(response.data, request)
        return response


class MyTokenRefreshView(TokenRefreshView):
    serializer_class = MyTokenRefreshSerializer

    def post(self, request, *args, **kwargs):
        response = super(MyTokenRefreshView, self).post(request, *args, **kwargs)
        create_login_event(response.data, request)
        return response
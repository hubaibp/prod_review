from rest_framework import serializers
from django.contrib.auth.models import User
from prodrev_app.models import Product,Reviews,UserProfile


class UserRegisterSerializer(serializers.ModelSerializer):
    id=serializers.IntegerField(read_only=True)
    class Meta:
        model=User
        fields=["id","username","email","password"]


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)  
    email = serializers.CharField(source='user.email', read_only=True)
    profile_picture = serializers.ImageField(required=False,allow_null=True)
    class Meta:
        model = UserProfile
        fields = ['username','email','phone', 'address', 'profile_picture']



class ReviewSerializer(serializers.Serializer):
    id=serializers.IntegerField(read_only=True)
    product=serializers.CharField(read_only=True)
    user=serializers.CharField(read_only=True)
    photo=serializers.ImageField(required=False)
    rating = serializers.IntegerField(required=True)
    comment = serializers.CharField(required=True)
    class Meta:
        model=Reviews
        fields="__all__"

    def validate_comment(self, value):
        if not value.strip():
            raise serializers.ValidationError("Comment cannot be empty or only whitespace.")
        return value


class ProductSerializer(serializers.ModelSerializer):
    image=serializers.ImageField(required=False)
    id=serializers.IntegerField(read_only=True)
    review_list=ReviewSerializer(read_only=True,many=True)
    rate=serializers.IntegerField(read_only=True)
    avg_rating=serializers.IntegerField(read_only=True)
    description = serializers.CharField(
        max_length=2000,
        style={'base_template': 'textarea.html', 'rows': 5, 'cols': 60}
    )
    class Meta:
        model=Product
        fields="__all__"

    def validate(self, data):
        if self.instance is None and "image" not in data:
            raise serializers.ValidationError({"image": "Image is required when creating a product."})
        return data
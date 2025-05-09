from rest_framework import serializers
from bson import ObjectId
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings
import os

from pymongo import MongoClient
client = MongoClient('mongodb://localhost:27017/')
db = client['QuanLyWebBanBanh']

class ObjectIdField(serializers.Field):
    def to_representation(self, value):
        return str(value)

    def to_internal_value(self, data):
        try:
            return ObjectId(data)
        except:
            raise serializers.ValidationError("Invalid ObjectId")

class CakeSerializer(serializers.Serializer):
    _id = ObjectIdField(read_only=True)
    name = serializers.CharField(max_length=100)
    description = serializers.CharField()
    price = serializers.IntegerField()
    image = serializers.ImageField(required=False, allow_null=True)
    category = ObjectIdField()
    category_name = serializers.CharField(max_length=100, required=False, read_only=True)

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        image_path = instance.get("image")
        if image_path:
            rep["image"] = settings.MEDIA_URL + image_path
        else:
            rep["image"] = None
        return rep

    def create(self, validated_data):
        image = validated_data.pop('image', None)
        if image:
            saved_path = default_storage.save(f'cakes/{image.name}', ContentFile(image.read()))
            validated_data['image'] = saved_path
        category = validated_data.get('category')
        if category is None:
            raise serializers.ValidationError({"category": "This field is required."})
        validated_data['category_id'] = category
        result = db.cakes.insert_one(validated_data)
        validated_data['_id'] = str(result.inserted_id)
        validated_data['category_id'] = str(validated_data['category_id'])
        return validated_data
class CategorySerializer(serializers.Serializer):
    _id = serializers.CharField(read_only=True)
    name = serializers.CharField(max_length=100)
class UserSerializer(serializers.Serializer):
    _id = serializers.CharField(read_only=True)
    name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    password = serializers.CharField()
    phone = serializers.CharField(max_length=15)
    is_staff = serializers.BooleanField(default=False)  # 
class PaymentSerializer(serializers.Serializer):
    _id = serializers.CharField(read_only=True)
    order_id = serializers.CharField()
    amount = serializers.IntegerField()
    method = serializers.CharField()
    status = serializers.CharField()
    created_at = serializers.DateTimeField()
class OrderSerializer(serializers.Serializer):
    _id = serializers.CharField(read_only=True)
    user_id = serializers.CharField()
    created_at = serializers.DateTimeField()
    items = serializers.ListField(child=serializers.DictField())
    total_order_price = serializers.IntegerField()
    order_status = serializers.CharField()
    payment_method = serializers.CharField()
    shipping_address = serializers.DictField()
    def create(self, validated_data):
        # Trả về dữ liệu để lưu vào MongoDB
        return validated_data
class CakeInCartSerializer(serializers.Serializer):
    _id = ObjectIdField()
    name = serializers.CharField()
    description = serializers.CharField()
    price = serializers.IntegerField()
    image = serializers.CharField()

class CartItemSerializer(serializers.Serializer):
    cake = CakeInCartSerializer()
    quantity = serializers.IntegerField()
    total_price = serializers.IntegerField()

class CartSerializer(serializers.Serializer):
    _id = ObjectIdField(read_only=True)
    user_id = ObjectIdField()
    created_at = serializers.DateTimeField()
    items = CartItemSerializer(many=True)
    total_cart_price = serializers.IntegerField()

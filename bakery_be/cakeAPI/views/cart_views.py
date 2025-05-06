from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from pymongo import MongoClient
from bson import ObjectId
from django.utils import timezone
from django.conf import settings

# Kết nối MongoDB
client = MongoClient("mongodb://localhost:27017")
db = client["QuanLyWebBanBanh"]
cart_collection = db["cart"]

class CartAPIView(APIView):
    def get(self, request):
        # Lấy user_id từ query parameters
        user_id = request.query_params.get("user_id")
        
        if not user_id:
            return Response({"error": "Missing user_id"}, status=status.HTTP_400_BAD_REQUEST)

        # Tìm giỏ hàng trong MongoDB theo user_id
        cart = cart_collection.find_one({"user_id": ObjectId(user_id)})

        # Kiểm tra nếu không có giỏ hàng
        if not cart:
            return Response({"message": "Giỏ hàng trống"}, status=status.HTTP_200_OK)

        # Chuyển ObjectId thành string để dễ đọc
        cart["_id"] = str(cart["_id"])
        cart["user_id"] = str(cart["user_id"])
        for item in cart["items"]:
            item["cake"]["_id"] = str(item["cake"]["_id"])

        return Response(cart, status=status.HTTP_200_OK)

class AddToCartAPIView(APIView):
    def post(self, request):
        data = request.data
        user_id = data.get("user_id")
        cake = data.get("cake")
        quantity = int(data.get("quantity"))

        if not user_id or not cake:
            return Response({"error": "Missing user_id or cake"}, status=status.HTTP_400_BAD_REQUEST)

        # Tính giá và total
        cake["_id"] = ObjectId(cake["_id"])
        cake["price"] = int(cake["price"])
        total_price = cake["price"] * quantity

        # Tìm giỏ hàng của người dùng
        cart = cart_collection.find_one({"user_id": ObjectId(user_id)})

        if cart:
            # Cập nhật giỏ hàng đã tồn tại
            found = False
            for item in cart["items"]:
                if item["cake"]["_id"] == cake["_id"]:
                    item["quantity"] += quantity
                    item["total_price"] = item["cake"]["price"] * item["quantity"]
                    found = True
                    break
            if not found:
                cart["items"].append({
                    "cake": cake,
                    "quantity": quantity,
                    "total_price": total_price
                })
            # Cập nhật tổng tiền
            cart["total_cart_price"] = sum(item["total_price"] for item in cart["items"])

            cart_collection.update_one(
                {"_id": cart["_id"]},
                {"$set": {
                    "items": cart["items"],
                    "total_cart_price": cart["total_cart_price"]
                }}
            )
        else:
            # Tạo giỏ hàng mới
            new_cart = {
                "user_id": ObjectId(user_id),
                "created_at": timezone.now(),
                "items": [
                    {
                        "cake": cake,
                        "quantity": quantity,
                        "total_price": total_price
                    }
                ],
                "total_cart_price": total_price
            }
            cart_collection.insert_one(new_cart)

        return Response({"message": "Thêm vào giỏ hàng thành công"}, status=status.HTTP_200_OK)
class AllCartsAPIView(APIView):
    def get(self, request):
        carts = list(cart_collection.find())
        result = []

        # Duyệt qua tất cả các giỏ hàng
        for cart in carts:
            # Chuyển ObjectId sang chuỗi
            cart["_id"] = str(cart["_id"])
            cart["user_id"] = str(cart["user_id"])
            cart["created_at"] = cart["created_at"].isoformat() if "created_at" in cart else ""

            # Chỉ lấy những thông tin cần thiết
            simplified_cart = {
                "user_id": cart["user_id"],
                "created_at": cart["created_at"],
                "total_cart_price": cart["total_cart_price"],
                "items_count": len(cart["items"]),  # Số lượng sản phẩm
                "items": [{
                    "cake_name": item["cake"]["name"],
                    "quantity": item["quantity"],
                    "total_price": item["total_price"]
                } for item in cart["items"]]
            }

            result.append(simplified_cart)

        return Response(result, status=status.HTTP_200_OK)
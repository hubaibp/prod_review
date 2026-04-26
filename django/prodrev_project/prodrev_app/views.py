from django.shortcuts import render
from prodrev_app.serializers import UserRegisterSerializer,UserProfileSerializer,ProductSerializer,ReviewSerializer
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated,IsAuthenticatedOrReadOnly
from rest_framework import authentication,permissions
from prodrev_app.models import Product,Reviews,Category,UserProfile
from django.http import JsonResponse
from django.views import View
from rest_framework.decorators import action
from django.db.models import Q
from dotenv import load_dotenv
import os
from groq import Groq

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)
# Create your views here.


class UserRegisterView(ModelViewSet):
    serializer_class = UserRegisterSerializer
    queryset = User.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = User.objects.create_user(**serializer.validated_data)
            
            UserProfile.objects.create(user=user)

            return Response(data={"message": "User registered successfully", "user": serializer.data})
        else:
            return Response(data=serializer.errors, status=400)

        
class UserLoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)

            role = "customer"
            if user.is_staff or user.is_superuser:
                role = "admin"

            response_data=({
                "token": token.key,
                "role": role  
            })
            # print("✅ Login Response:", response_data)

            return Response(response_data)
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
    

class UserProfileView(APIView):
    authentication_classes=[authentication.TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        profile = UserProfile.objects.get(user=request.user)
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class ListCategoriesView(View):
    def get(self, request, *args, **kwargs):
        categories = Category.objects.filter(is_active=True).values("id", "category_name")
        return JsonResponse(list(categories), safe=False)

class CategoryProductsView(APIView):
    def get(self, request, id):
        products = Product.objects.filter(category_id=id)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)



class ProductView(ModelViewSet):
    authentication_classes=[authentication.TokenAuthentication]
    permission_classes=[permissions.IsAuthenticatedOrReadOnly]

    serializer_class=ProductSerializer
    queryset=Product.objects.all()

    def list(self, request, *args, **kwargs):
        search_query = request.query_params.get('search', None)
        print(f"Search query: {search_query}")
        print(self.queryset.query)
        if search_query:
            self.queryset = self.queryset.filter(
                Q(product_name__icontains=search_query) |
                Q(description__icontains=search_query) |
                Q(category__category_name__icontains=search_query)
            )
        return super().list(request, *args, **kwargs)
    

    @action(methods=['post'],detail=True,permission_classes=[IsAuthenticated])
    def add_review(self,request,*args,**kwargs):        #http://127.0.0.1:8000/products/1/add_review/
        user=request.user
        product=Product.objects.get(id=kwargs.get("pk"))

        if Reviews.objects.filter(user=user, product=product).exists():
            return Response({"error": "You can only review a product once."}, status=status.HTTP_400_BAD_REQUEST)

        serializer=ReviewSerializer(data=request.data,context={'request':request})
        if serializer.is_valid():
            Reviews.objects.create(user=user,product=product,**serializer.validated_data)
            return Response(data=serializer.data)
        else:
            return Response(data=serializer.errors)
        
    @action(methods=['get'], detail=True, permission_classes=[IsAuthenticatedOrReadOnly])
    def get_reviews(self, request, *args, **kwargs):        #http://127.0.0.1:8000/product/1/get_reviews/
        product=Product.objects.get(id=kwargs.get("pk"))
        reviews = Reviews.objects.filter(product=product)
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)
    
    @action(methods=['get'], detail=True, permission_classes=[])
    def ai_review_analysis(self, request, *args, **kwargs):

        product = Product.objects.get(id=kwargs.get("pk"))
        reviews = Reviews.objects.filter(product=product)

        if not reviews.exists():
            return Response({"message": "No reviews available"})

        review_text = "\n".join([
            f"Rating: {r.rating}/5, Comment: {r.comment}"
            for r in reviews
        ])

        prompt = f"""
        Analyze all customer reviews of this product.

        Product Name: {product.product_name}

        Reviews:
        {review_text}

        Give answer in this format:

        1. Overall sentiment
        2. Good things customers say
        3. Common complaints
        4. Risk level (Low/Medium/High)
        5. Final admin recommendation
        """

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        result = response.choices[0].message.content

        return Response({
            "product": product.product_name,
            "analysis": result
        })

from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator,MaxValueValidator
from django.contrib.auth.models import User
# Create your models here.

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

    def __str__(self):
        return self.user.username

class Category(models.Model):
    category_name=models.CharField(max_length=100)
    is_active=models.BooleanField(default=True)

    def __str__(self):
        return self.category_name
    
class Product(models.Model):
    product_name=models.CharField(max_length=100)
    image=models.ImageField(upload_to="photos")
    price=models.PositiveIntegerField()
    description=models.TextField(max_length=2000)
    category=models.ForeignKey(Category,on_delete=models.CASCADE)

    def __str__(self):
        return self.product_name

    def review_list(self):
        return self.reviews_set.all() 


    def avg_rating(self):
        rev = self.reviews_set.all()
        rating = [i.rating for i in rev]
        
        if not rating:  
            return 0  
        
        return sum(rating) / len(rating)  


class Reviews(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    product=models.ForeignKey(Product,on_delete=models.CASCADE)
    comment=models.CharField(max_length=100)
    rating=models.PositiveIntegerField(validators=[MinValueValidator(1),MaxValueValidator(5)])

    class Meta:
        unique_together=('user','product')


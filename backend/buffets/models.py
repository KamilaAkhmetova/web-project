from django.db import models
from datetime import datetime

# Custom Manager
class BuffetManager(models.Manager):
    def open_now(self):
        """Return buffets that are open at current time"""
        current_day = datetime.now().weekday()
        current_time = datetime.now().time()
        
        open_buffets = []
        for buffet in self.all():
            hours = buffet.hours.filter(day=current_day, is_closed=False)
            for hour in hours:
                if hour.open_time <= current_time <= hour.close_time:
                    open_buffets.append(buffet)
                    break
        return open_buffets
    
    def with_food_count(self):
        return self.annotate(foods_count=models.Count('foods'))

class Buffet(models.Model):
    name = models.CharField(max_length=100)
    address = models.TextField()
    is_temporarily_closed = models.BooleanField(default=False)

    
    objects = BuffetManager()
    
    def __str__(self):
        return self.name
    
    @property
    def status(self):
        if self.is_temporarily_closed:
            return "Temporarily closed"
        current_day = datetime.now().weekday()
        current_time = datetime.now().time()
        hours = self.hours.filter(day=current_day, is_closed=False)
        for hour in hours:
            if hour.open_time <= current_time <= hour.close_time:
                return "Open"
        return "Closed"

class OpeningHours(models.Model):
     
    DAYS = [
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday'),
    ]
    
    buffet = models.ForeignKey(Buffet, on_delete=models.CASCADE, related_name='hours')
    day = models.IntegerField(choices=DAYS)
    open_time = models.TimeField(null=True, blank=True)
    close_time = models.TimeField(null=True, blank=True)
    is_closed = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ['buffet', 'day']
        ordering = ['day']
    
    def __str__(self):
        if self.is_closed:
            return f"{self.get_day_display()}: Closed"
        return f"{self.get_day_display()}: {self.open_time} - {self.close_time}"

class Food(models.Model):
    buffet = models.ForeignKey(Buffet, on_delete=models.CASCADE, related_name='foods')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price_student = models.DecimalField(max_digits=6, decimal_places=2)
    price_employee = models.DecimalField(max_digits=6, decimal_places=2)
    price_guest = models.DecimalField(max_digits=6, decimal_places=2)
    category = models.CharField(max_length=100, blank=True, default='Hi. jídlo')
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} - {self.buffet.name}"
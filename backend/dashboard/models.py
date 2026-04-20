from django.db import models

class News(models.Model):
    title = models.CharField(max_length=200, verbose_name="Title")
    content = models.TextField(verbose_name="Content")
    date = models.DateTimeField(auto_now_add=True, verbose_name="Date")
    
    class Meta:
        ordering = ['-date']  
        verbose_name = "News"
        verbose_name_plural = "News"
    
    def __str__(self):
        return self.title
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'full_name', 'practice_group', 'is_teacher', 'is_staff')
    list_filter = ('is_teacher', 'is_staff', 'practice_group')
    fieldsets = UserAdmin.fieldsets + (
        ('Дополнительная информация', {'fields': ('full_name', 'phone', 'practice_group', 'is_teacher')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Дополнительная информация', {'fields': ('full_name', 'phone', 'practice_group', 'is_teacher')}),
    )

admin.site.register(User, CustomUserAdmin)
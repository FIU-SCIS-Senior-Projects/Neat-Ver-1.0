from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(School)
admin.site.register(SchoolRoster)
admin.site.register(Class)
admin.site.register(ClassRoster)
admin.site.register(Assignment)
admin.site.register(AssignmentRoster)
admin.site.register(Task)
from django.contrib import admin
from django.core.cache import cache

from .models import SiteConfig, ImageConfig


def clear_all_caches(modeladmin, request, queryset):
    cache.clear()


clear_all_caches.short_description = 'Clear all caches on the site'


class SiteConfigAdmin(admin.ModelAdmin):
    actions = [clear_all_caches]


class ImageConfigAdmin(admin.ModelAdmin):
    test = 1


admin.site.register(SiteConfig, SiteConfigAdmin)
admin.site.register(ImageConfig, ImageConfigAdmin)
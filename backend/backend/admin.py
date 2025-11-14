from django.contrib import admin
from .models import Gasto, Ingreso, Logro, Meta, Metodologia

@admin.register(Gasto)
class GastoAdmin(admin.ModelAdmin):
    list_display = ('id', 'usuarioid', 'monto', 'categoria', 'fecha', 'descripcion')
    list_filter = ('categoria', 'fecha', 'usuarioid')
    search_fields = ('descripcion', 'categoria', 'usuarioid__nombrecompleto')
    date_hierarchy = 'fecha'

@admin.register(Ingreso)
class IngresoAdmin(admin.ModelAdmin):
    list_display = ('id', 'usuarioid', 'monto', 'fecha')
    list_filter = ('fecha', 'usuarioid')
    search_fields = ('usuarioid__nombrecompleto',)
    date_hierarchy = 'fecha'

@admin.register(Logro)
class LogroAdmin(admin.ModelAdmin):
    list_display = ('id', 'usuarioid', 'nombre', 'condicion')
    list_filter = ('usuarioid',)
    search_fields = ('nombre', 'condicion', 'usuarioid__nombrecompleto')

@admin.register(Meta)
class MetaAdmin(admin.ModelAdmin):
    list_display = ('id', 'usuarioid', 'nombre', 'montoobjetivo', 'montoactual')
    list_filter = ('usuarioid',)
    search_fields = ('nombre', 'usuarioid__nombrecompleto')

@admin.register(Metodologia)
class MetodologiaAdmin(admin.ModelAdmin):
    list_display = ('id', 'usuarioid', 'descripcion')
    list_filter = ('usuarioid',)
    search_fields = ('descripcion', 'usuarioid__nombrecompleto')












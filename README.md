# Ternopel

## Como instalar y configurar Ternopel

( Leer esta p�gina antes de comenzar: https://github.com/nodejs/node-gyp )

- Descargar Nodeclipse "Enide 2015"
- Instalar python 2.7 ( el exe, no el de cygwin )
- Instalar nodejs 4
- Instalar Visual Studio Community 2015 ( marcando Common Tools for Visual C++ y Instalar Windows SDK version 8.1 ) 
- Instalar postgresql 9
- Crear base de datos ternopel y ternopel_test
- En directorio de descarga, correr:
 ``
npm.cmd install 
``
- Crear carpeta products/images y products/testimages

## Como instalar y configurar ElasticSearch

- Descargar Elastic Search 2.3.3
- Instalarlo en algun lado
- Instalar el Windows Service corriendo el comando
- Asegurarse que %JAVA_HOME% esta en la configuracion de la computadora y no en la del usuario
``
<ElasticSearchDir>\bin\service.bat install <ServiceName>
``


## Como instalar REDIS

- Descargarlo redis-2.4.6-setup-64-bit.exe de https://github.com/rgl/redis/downloads
- Instalarlo

# Postinstalacion

- Crear carpetas posters, posters/testimages e posters/images
- Crear carpetas products, products/testimages e products/images
- Correr a mano:
``
create table products_formats_backup as select * from products_formats;
``

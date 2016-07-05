# Ternopel 

## Como instalar y configurar solr

- Descargar solr 6
- Instalarlo en algun lado
- Correr los scripts de startup y shutdown del directorio support\solr
- Correr la creacion de los cores para ternopel y ternopel_test ( donde se alojaran los indices )
  - solr.cmd create -c ternopel -d basic_configs
  - solr.cmd create -c ternopel_test -d basic_configs



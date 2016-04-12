export CLASSPATH="support/liquibase/postgresql-9.3-1101-jdbc4.jar;support/liquibase/liquibase-core-2.0.3.jar"
java liquibase.integration.commandline.Main \
      --driver=org.postgresql.Driver \
      --changeLogFile=support/liquibase/liquibase.xml \
      --url=jdbc:postgresql://localhost:5432/ternopel?charSet=UTF-8 \
      --username=postgres \
      --password=Pilarcita1 \
      $1

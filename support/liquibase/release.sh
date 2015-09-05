java -cp postgresql-9.3-1101-jdbc4.jar -jar liquibase-core-2.0.3.jar \
      --driver=org.postgresql.Driver \
      --changeLogFile=liquibase.xml \
      --url=jdbc:postgresql://localhost:5432/ternopel?charSet=UTF-8 \
      --username=postgres \
      --password=Pilarcita1 \
      releaseLocks



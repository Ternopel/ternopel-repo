s3cmd sync public/* -P --verbose --add-header=cache-control:max-age=16070400,public s3://ternopel
#s3cmd -m "text/css" --add-header=content-type:"text/css" sync public/* -P --verbose --add-header=cache-control:max-age=16070400,public s3://ternopel

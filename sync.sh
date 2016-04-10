function compress() {

	extension=$1
	mime=$2

	echo "Removing /tmp/public ..."
	rm -fR /tmp/public
	echo "Creating /tmp/public ..."
	mkdir /tmp/public
	echo "Copying files $extension to /tmp/public ..."
	cp --parents `find public -name "$extension"` /tmp
	echo "Compressing files $extension ..."
	find /tmp/public -name "$extension" -print -exec gzip {} \; -exec mv {}.gz {} \;
	echo "Sending files $extension to s3 ..."
	s3cmd -m $mime --add-header=content-type:$mime sync /tmp/public/* -P --verbose --add-header=cache-control:max-age=31536000,public --add-header=content-encoding:gzip --add-header=expires:'Mon, 01 Apr 2017 23:16:20 GMT' s3://ternopel
	echo "Done !!"

}

function nocompress() {

	extension=$1
	mime=$2

	echo "Removing /tmp/public ..."
	rm -fR /tmp/public
	echo "Creating /tmp/public ..."
	mkdir /tmp/public
	echo "Copying files $extension to /tmp/public ..."
	cp --parents `find public -name "$extension"` /tmp
	echo "Sending files $extension to s3 ..."
	s3cmd -m $mime --add-header=content-type:$mime sync /tmp/public/* -P --verbose --add-header=cache-control:max-age=31536000,public --add-header=expires:'Mon, 01 Apr 2017 23:16:20 GMT' s3://ternopel
	echo "Done !!"

}

compress "*.css" "text/css"
compress "*.js" "application/javascript"
nocompress "*.jpg" "image/jpeg"
nocompress "*.png" "image/png"

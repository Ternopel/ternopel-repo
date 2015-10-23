find . \( \
	-name .classpath -o \
	-name .gwt -o \
	-name .project -o \
	-name .settings -o \
	-name target -o \
	-name test-output -o \
	-name www-test \
\) -print -exec rm -fR {} \; 2>/dev/null

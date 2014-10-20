import urllib2


try:
	data = urllib2.urlopen("http://104.131.118.92:5000/static/online/",timeout = 10)
	for line in data:
		print(line)
except urllib2.URLError, e:
	print("There was an error, is server off?")

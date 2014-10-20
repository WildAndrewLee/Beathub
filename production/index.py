from flask import Flask, render_template, request
import time
import os
from flask_debugtoolbar import DebugToolbarExtension

app  = Flask(__name__)

@app.route("/")
def hello():
	return '<a href="http://104.131.118.92:5000/upload">Upload WAV File</a>';

@app.route("/static")
def giveFile():
	return "hnttn"

@app.route("/music/<int:name>/<int:channel_num>", methods=['GET'])
def givemusic(name, channel_num):
	return render_template('playmusic.html', name=name, channel=channel_num)

@app.route('/upload', methods=['GET', 'POST'])
def putmusic():
	filename = ''
	channels = 0

	if request.method == 'POST':
		file = request.files['file']

		print file

		if file:
			filename = str(int(time.time()))
			path = os.path.join('/root/flask/static/media/', filename)
			file.save(path)

			output = os.popen('java -jar /root/flask/static/beathub.jar ' + path)
			print output.readline()
			print output.readline()
			channels = int(output.readline().rstrip().split(' ')[1])

			print channels

			return 'Path: http://104.131.118.92:5000/music/' + filename + '; Channels: ' + str(channels) + ';'
	else:
		return render_template('upload.html', filename=filename, channels=channels)

@app.route("/control/<int:name>", methods=['GET'])
def giveControls(name):
	return render_template('control.html', name=name)

toolbar = DebugToolbarExtension(app)

if __name__ == "__main__":
	app.debug=True
	app.run(host='0.0.0.0')
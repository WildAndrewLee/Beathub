from flask import Flask, request, render_template
app = Flask(__name__)

@app.route('/<filename>')
def song(filename):
	return render_template('play.html',
				title = filename, 
				music_file = filename)

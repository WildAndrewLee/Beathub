var read = new FileReader();
var uploader = document.getElementById('upload');
var uploads = document.getElementById('uploads');
var caside = null;
var current = 0;
var music = [];
var form = new FormData();

function dragOver(e){
	e.stopPropagation();
	e.preventDefault();
}

function drop(e){
	e.stopPropagation();
	e.preventDefault();

	console.log(e);

	var audio = e.dataTransfer.files;

	if(audio.length == 1){
		audio = audio[0];

		if(audio.type.match('audio.*')){
			var aside = document.createElement('aside');
			aside.innerHTML = '<span class="upload">' + audio.name + '</span>';
			uploader.appendChild(aside);

			document.getElementById('instruct').innerHTML = '<button id="uploadButton">Click to Upload</button>';
			document.getElementById('uploadButton').addEventListener('click', upload);
		}

		form.append('file', audio);
	}
}

function upload(){
	var request = new XMLHttpRequest();
	request.open('POST', 'upload');

	request.onload = function(){
		if(request.status == 200){
			uploads.innerHTML = '';

			var params = request.responseText.split(';');

			var path = params[0].split(' ')[1]
			var channels = parseInt(params[1].split(' ')[2])

			uploads.innerHTML += '<span class="upload"><a href="' + path.replace('music', 'control') + '">Control Panel</a></span>';

			for(var n = 0; n < channels; n++)
				uploads.innerHTML += '<span class="upload"><a href="' + path + '/' + (n + 1) + '">Channel ' + (n + 1) + '</a></span>';
		}
	}

	request.send(form);
}

uploader.addEventListener('dragover', dragOver, false);
uploader.addEventListener('drop', drop, false);
var socket = new WebSocket('ws://104.131.118.92:4242/websocket');

socket.onmessage = function(evt){
	console.log(evt);

	if(evt.data == 'play'){
		document.getElementById('player').play();
		document.getElementById('status').className = 'good';
	}
	else if(evt.data == 'pause'){
		document.getElementById('player').pause();
		document.getElementById('status').className = 'bad';
	}
};

socket.onopen = function(evt){
	var args = location.href.split('/');
	var id = args[args.length - 2];

	socket.send('id:' + id);
}
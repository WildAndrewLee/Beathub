var socket = new WebSocket('ws://104.131.118.92:5000/websocket');

socket.onmessage = function(evt){
	if(evt.data == 'play'){
		$('#player')[0].play();
	}
	else if(evt.data == 'pause'){
		$('#player')[0].pause();
	}
};

$('#play').click(function(){
	socket.send('play');
});

$('#pause').click(function(){
	socket.send('pause');
});
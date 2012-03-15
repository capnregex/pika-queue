$(document).ready(function() {

	socket = new io.Socket(null, {port: 8081, transports: ['websocket', 'htmlfile', 'xhr-multipart', 'xhr-polling']});
	socket.connect();
	
	$('#sender').bind('click', function() {
		socket.emit('message', 'message : ' + $('#message').val());
	});
	
	socket.on('message', function(data){
		$('#reciever').append('<li>' + data + '</li>');
	});
	
});

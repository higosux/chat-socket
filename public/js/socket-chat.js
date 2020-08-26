var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('name') || !params.has('room')) {
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios');
}

var user = {
    name: params.get('name'),
    room: params.get('room')
}

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('enterChat', user, function(resp) {
        //console.log('Usuarios conectado: ', resp);
        usersRender(resp);
    })
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});



// Escuchar información
socket.on('createMessage', function(message) {

    // console.log('Servidor:', message);
    messagesRender(message, false);
    scrollBottom();

});

//escuchar cambios de usuarios cuando un usaurio entra y sale de la sala
socket.on('listPerson', function(persons) {


    usersRender(persons);

});

//Mensajes privados

socket.on('privateMessage', function(message) {
    console.log('Mensaje privado', message);
})
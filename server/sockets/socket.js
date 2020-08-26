const { io } = require('../server');
const { Users } = require('../classes/users')
const users = new Users();
const { createMessage } = require('../utilities/utilities')

io.on('connection', (client) => {


    client.on('enterChat', (data, callback) => {

        if (!callback) return;

        if (!data.name || !data.room) {
            return callback({
                ok: true,
                message: 'El nombre/sala es necesario'
            });
        }

        client.join(data.room);

        let persons = users.addPerson(client.id, data.name, data.room);

        
        client.broadcast.to(data.room).emit('listPerson', users.getPersonsPerRoom(data.room));
        client.broadcast.to(data.room).emit('createMessage', createMessage('Admin', `${data.name} se unió`));

        callback(users.getPersonsPerRoom(data.room));


    });

    client.on('disconnect', () => {

        let deletedPerson = users.deletePerson(client.id);

        client.broadcast.to(deletedPerson.room).emit('createMessage', createMessage('Admin', `${deletedPerson.name} salio`));
        client.broadcast.to(deletedPerson.room).emit('listPerson', users.getPersonsPerRoom(deletedPerson.room));

    });

    client.on('createMessage', (data, callback) => {

        let person = users.getPerson(client.id);
        let message = createMessage(person.name, data.message);

        client.broadcast.to(person.room).emit('createMessage', message);


        callback(message);
    });

    client.on('privateMessage', data => {

        let person = users.getPerson(client.id);

        client.broadcast.to(data.to).emit('privateMessage', createMessage(person.name, data.message));

    });

});
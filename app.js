const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const connectToMongo = require('./db');
const Message = require('./model/Message'); // Asegúrate de que la ruta sea correcta

connectToMongo();

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

// Ruta principal que sirve el archivo index.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', async (socket) => {
    console.log('Un usuario se ha conectado');

    try {
        const messages = await Message.find().sort({ timestamp: 1 }).limit(50);
        socket.emit('previous messages', messages);
    } catch (err) {
        console.error(err);
    }

  // Escuchar nuevos mensajes
  socket.on('chat message', (data) => {
    let message = new Message({ user: data.user, text: data.text });
    message.save()
      .then(() => {
        io.emit('chat message', message);
      });
  });

  // Escuchar evento de usuario escribiendo
  socket.on('typing', (user) => {
    socket.broadcast.emit('user typing', user);
  });

  socket.on('disconnect', () => {
    console.log('Un usuario se ha desconectado');
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

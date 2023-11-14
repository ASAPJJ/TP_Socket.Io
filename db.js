// db.js
const mongoose = require('mongoose');

const mongoURI = ''; // Reemplaza con tu cadena de conexión a mongoDB

const connectToMongo = () => {
    mongoose.connect(mongoURI)
        .then(() => console.log('Conectado a MongoDB'))
        .catch(err => console.error('No se pudo conectar a MongoDB', err));
}

module.exports = connectToMongo;




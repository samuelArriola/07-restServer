require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');

// app.set('port', process.env.PORT || 3000);
app.use(express.json());

//congiguracion global de rutas //esto es para no escribir todas las rutas aqui; ORDENAR
app.use(require('./router/index'));

//habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));
console.log(path.resolve(__dirname, '../public'));


mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false },
    (err, res) => {
        if (err) throw err;
        console.log('base de daos online');

    });

app.listen(process.env.PORT, () => {
    console.log(`listen on ${process.env.PORT}`);
})
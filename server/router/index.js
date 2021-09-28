//colocamos todas las rutas a llamar en nuestro archivo principal (server.js)
//esto es para ordenar el codigo

const express = require('express');
const app = express();

app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./producto'));
app.use(require('./categoria'));
app.use(require('./productov.js'));
app.use(require('./uploads.js'));
app.use(require('./imagenes.js'));


module.exports = app;
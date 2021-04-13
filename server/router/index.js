//colocamos todas las rutas a llamar en nuestro archivo principal (server.js)
//esto es para ordenar el codigo

const express = require('express');
const app = express();

app.use(require('./usuario'));
app.use(require('./login'));


module.exports = app;
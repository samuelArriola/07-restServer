const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const Usuario = require('../model/usuario');


app.post('/login', (req, res) => {

    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //validamos cuando no exista el error
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    massage: '(Usuario) o contraseña incorrecta'
                }
            });
        }

        //validamos la contraseña 
        //encriptamos la contraseña ingresamos y conparamos con la que esta en la base de datos
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    massage: 'Usuario o (contraseña) incorrecta'
                }
            });
        }

        //creo el token 
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }); //esto numeros estan representados en sg 60*60*24*30 el producto de esto equivale a  los sg de 30 dias; LO ALMACENO EN UNA VARIABLE ENV PARA PODER CAMBIAR LOS TIENPOS DE CADUCIDAD 

        //si no hay ningun error
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    });
})


module.exports = app;
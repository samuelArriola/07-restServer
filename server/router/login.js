const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const Usuario = require('../model/usuario');

//aut googlr 
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


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


//config de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,
    }

}


app.post('/googlee', async(req, res) => {

    let token = req.body.token;
    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: {
                    e,
                    mensaje: "este es el error",
                    token
                }
            })
        })

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'usuario ya registrado, debe usar su autenticación normal '
                    }
                });
            } else {
                //creo el token otra vez
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }); //esto numeros estan representados en sg 60*60*24*30 el producto de esto equivale a  los sg de 30 dias; LO ALMACENO EN UNA VARIABLE ENV PARA PODER CAMBIAR LOS TIENPOS DE CADUCIDAD 

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                })
            }
        } else {
            // si el usuario no existe en nuestra base de datos 
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';



            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err: err
                    })
                }

                //creo el token otra vez
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }); //esto numeros estan representados en sg 60*60*24*30 el producto de esto equivale a  los sg de 30 dias; LO ALMACENO EN UNA VARIABLE ENV PARA PODER CAMBIAR LOS TIENPOS DE CADUCIDAD 

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                })

            });
        }


    })

});


module.exports = app;
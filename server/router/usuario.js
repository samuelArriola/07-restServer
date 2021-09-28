const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const app = express();
const Usuario = require('../model/usuario');
const { verificaToken, verifica_usuario } = require('../middlewares/autenticacion');



//verificaToken: es un middleware que rectifica el token
//los corchetes son para meter mas de un meddleware
app.get('/user', [verificaToken, verifica_usuario], (req, res) => {
    //obtengo la informacion del token
    const { nombre, email, role } = req.usuario;
    /*  
    return res.json({
        usuario: req.usuario,
        email,
        nombre
    }) */

    //obtengo un dato opcional para filtrar 
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    //primer parametro es para filtrar "es una especie de WHERE"
    //segundo parametre: para solo mostrar los campos que elijas, si no se especifica nada se escorejeran todos los resultados
    Usuario.find({ estado: true }, 'nombre email role google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Usuario.countDocuments({ estado: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    role,
                    conteo,
                    usuarios
                });
            })
        })
})

//agredar datos a la base de datos 
app.post('/user', verificaToken, (req, res) => {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10), //encriptar
        img: body.img,
        role: body.role,
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            })
        }
        //usuarioDB.password = null; //ocultala el valor de la contraseña al mostrarse
        res.json({
            ok: true,
            usuario: usuarioDB
        })

    });

})

//Actualizar
app.put('/user/:id', [verificaToken, verifica_usuario], (req, res) => {
    let { id } = req.params;
    let body = _.pick(req.body, ['nombre', 'role', 'img', 'estado']); //solo ingresamos los que se pueden editar 

    // si queremos que el usuario no pueda actualizar campos que no debe
    //cuando son muchos datos,, usamos la pripiedad pick() que nos ofrece el paquete "underscore"
    // delete body.email; //el campo nose afectara 

    // runValidators: true : corelas validaciones que estan creadas en el modelo 
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => { //new es un parametro que muestra los datos ya actualizada "leer docimentacion"
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    })
})

//borrar
app.delete('/user/:id', [verificaToken, verifica_usuario], (req, res) => {
    let { id } = req.params;
    Usuario.findByIdAndDelete(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //cuando vuelve a borra el usuario borrado
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuarioBorrado
        });
    });
})

//borrado logico
app.put('/user/delLog/:id', verificaToken, (req, res) => {
    let { id } = req.params;
    let body = _.pick(req.body, ['estado']); //se puede hacer por body o se puede crear una variables
    let borraLogico = { //solo cambias el parametro a llamar "findByIdAndUpdate"  
        estado: false
    }

    Usuario.findByIdAndUpdate(id, borraLogico, { new: true, runValidators: true }, (err, usuarioDB) => { //new es un parametro que muestra los datos ya actualizada "leer docimentacion"
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    })
})

module.exports = app;
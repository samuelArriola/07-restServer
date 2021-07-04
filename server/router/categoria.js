const express = require('express');
const app = express();
let Categoria = require('../model/categoria');
const { verificaToken, verifica_usuario } = require('../middlewares/autenticacion');

app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('nombre') //organiza la impormacion 
        .populate('usuario', 'nombre email') //nombre de la collection  //datos que quieres mostrar del objeto
        .exec((err, categoria) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!categoria) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Aún no se encuentran categorias registradas'
                    }
                });
            }



            res.json({
                ok: true,
                categoria

            })

        })

})

app.get('/categoria/:id', verificaToken, (req, res) => {
    let { id } = req.params;
    console.log(id);
    Categoria.findById(id, (err, categoria) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoria) {
            return res.status(400).json({
                ok: false,
                err: {
                    menssage: 'categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria

        })

    })

})

app.post('/categoria', verificaToken, (req, res) => {
    let { nombre, _id } = req.usuario;
    let body = req.body;

    console.log(`nombre es ${nombre} y el id es  ${_id}`);

    let categoria = new Categoria({
        nombre: body.nombre,
        desc: body.desc,
        usuarios: _id,

    });

    categoria.save((err, categoria) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoria) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria

        });
    })
})

app.put('/categoria/:id', verificaToken, (req, res) => {

    let { id } = req.params;
    let body = req.body;

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoria) => {
        if (err) {
            return res.json.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoria) {
            return res.json.status(400).json({
                ok: false,
                err: {
                    menssage: 'categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria
        })
    });
})

app.delete('/categoria/:id', [verificaToken, verifica_usuario], (req, res) => {
    let { id } = req.params;

    Categoria.findByIdAndDelete(id, (err, categoria) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoria) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'el id no existe'
                }
            });
        }

        res.json({
            ok: true,
            categoria
        })
    })

})


module.exports = app;
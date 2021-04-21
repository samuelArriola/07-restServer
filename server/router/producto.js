const express = require('express');
const app = express();
const Producto = require('../model/producto.js');
const { verificaToken, verifica_usuario } = require('../middlewares/autenticacion');

//ver lisat de productos
app.get('/producto', (req, res) => {

    //recibinos parametros que pueden ser opcinales
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let hasta = req.query.hasta || 5;
    hasta = Number(hasta);

    Producto.find({ estado: true })
        .skip(desde)
        .limit(hasta)
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Producto.countDocuments({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    conteo,
                    producto: productoDB
                });
            })

        });


})

//agregar 
app.post('/producto', (req, res) => {
    let body = req.body;
    let producto = new Producto(body);
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });

})

// editar
app.put('/producto/:id', (req, res) => {
    let { id } = req.params;
    let body = req.body;

    Producto.findByIdAndUpdate(id, body, { new: true, runValidator: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    })
})

//eliminado logico
app.put('/producto/delLog/:id', [verificaToken, verifica_usuario], (req, res) => {
    let { id } = req.params;
    let borrarLogico = {
        estado: false
    }

    Producto.findByIdAndUpdate(id, borrarLogico, { new: true, runValidator: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    })
})

//borrado fisico 
app.delete('/producto/:id', [verificaToken, verifica_usuario], (req, res) => {
    let { id } = req.params;
    Producto.findByIdAndDelete(id, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    })
})


module.exports = app;
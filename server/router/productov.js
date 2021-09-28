const express = require('express');
const app = express();
const Productov = require('../model/productov');
const _ = require('underscore');
const { verificaToken } = require('../middlewares/autenticacion');

//obtener todo
app.get('/productov', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let cuenta = req.query.cuenta || 3;
    cuenta = Number(cuenta);

    Productov.find({ disponible: true })
        .sort('nombre')
        .skip(desde)
        .limit(cuenta)
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre')
        .exec((err, productovDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            Productov.countDocuments({ disponible: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    conteo,
                    productovDB
                })

            })
        })
})

//BUSCAR UN PRODUCTO
app.get('/pruductoBuscar/:termino', (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Productov.find({ nombre: regex, disponible: true })
        .populate('categoria', 'nombre')
        .exec((err, productoBuscarBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!productoBuscarBD) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: `no exixten productos con el nombre de ${regex}`
                    }
                })

            }

            res.json({
                ok: true,
                productoBuscarBD
            });
        })


});


//obtener 1 
app.get('/productov/:id', (req, res) => {
    let { id } = req.params;
    Productov.findById(id)
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre')
        .exec((err, productovDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productovDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        messaje: 'El producto aún no ha sido registrado'
                    }
                });
            }

            res.json({
                ok: true,
                productovDB
            });

        })
})

//crear uno
app.post('/productov', [verificaToken], (req, res) => {
    let body = req.body;
    const { _id } = req.usuario;

    let productov = new Productov({
        nombre: body.nombre,
        precioUni: body.precioUni,
        desc: body.desc,
        categoria: body.categoria,
        usuario: _id
    })

    productov.save((err, productovDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            productovDB
        });
    });
})

//actualizar
app.put('/productov/:id', (req, res) => {
    let { id } = req.params;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'desc', 'categoria']);

    Productov.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productovDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productovDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    messaje: 'El producto no existe'
                }
            });
        }


        res.json({
            ok: true,
            productovDB
        });

    });
})

//borrado logico
app.delete('/productov/borrar/:id', (req, res) => {

    let { id } = req.params;
    Productov.findById(id, (err, productovDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productovDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    messaje: 'El producto no existe'
                }
            });
        }

        //aqui hago los cmabios  necesito 
        productovDB.disponible = false;
        productovDB.save((err, productovBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                message: 'Producto borrado',
                productovBorrado
            });

        })


    });
})





module.exports = app;
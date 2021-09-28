const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../model/usuario');
const Productov = require('../model/productov');
const fs = require('fs');
const path = require('path');

//default options
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;


    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'no se ha cargano ningún archivo'
        });
    }

    //Valido los TIPOS 
    let tiposValidos = ['usuario', 'producto'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Tipo no permitido, Los tipos permitidas son ' + tiposValidos.join(', ')
        });
    }


    //obtengo el archivo que viene del front //archivo: nombre del campo
    let archivo = req.files.archivo;
    let NombreCortado = archivo.name.split('.');
    let extension = NombreCortado[NombreCortado.length - 1]; // 'NombreCortado.length -1': obtine la ultima parte de la cadena 

    //Validar las extensiones validas 
    let extensionesValidas = ['png', 'jpg', 'gif', 'jprg'];

    // se valida cuando no existe la extecion en el rango ; indexOf: verifica que exista un elemento en el array
    if (extensionesValidas.indexOf(extension.toLowerCase()) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Tipo de archivo no permitido, Las extensiones permitidas son ' + extensionesValidas.join(', ')
        });
    }

    //Nombre del archivo 
    let nombreArchivo = `${ id }-${new Date().getMilliseconds()}.${ extension}`;

    archivo.mv(`uploads/${tipo}/${ nombreArchivo }`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        //lo subo a mi base de datos

        if (tipo === 'usuario') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo)
        }
    })

});


//------------------------------//----------------------------------------------------//

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioBD) => {

        if (err) {
            borraArchivo(nombreArchivo, 'usuario'); // se colocan para borra las imagenes que se montaron pero que no se van a usar 
            return res.status(500).json({
                ok: flase,
                err
            })
        }

        if (!usuarioBD) {
            borraArchivo(nombreArchivo, 'usuario');
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El usuario no exixte'
                }
            })
        }


        borraArchivo(usuarioBD.img, 'usuario');

        usuarioBD.img = nombreArchivo;

        usuarioBD.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });

        });
    });
}


function borraArchivo(nombreImagen, tipo) {
    let pahtImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    console.log(pahtImagen);
    if (fs.existsSync(pahtImagen)) { //verifica que exista la imagen
        fs.unlinkSync(pahtImagen); //borra la imagen
    }
}

function imagenProducto(id, res, nombreArchivo) {
    Productov.findById(id, (err, productoBD) => {
        if (err) {
            borraArchivo(nombreArchivo, 'producto');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoBD) {
            borraArchivo(nombreArchivo, 'producto');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado, intente con otro ID'
                }
            });
        }

        borraArchivo(productoBD.img, 'producto');

        productoBD.img = nombreArchivo;

        productoBD.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });


        });

    });
}

module.exports = app;
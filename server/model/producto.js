const mongoose = require('mongoose');
let Schema = mongoose.Schema;
let uniqueValidator = require('mongoose-unique-validator');

let productoShema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario'],
        unique: true
    },
    precio: {
        type: String,
        required: [true, 'El precio es necesario']
    },
    estado: {
        type: Boolean,
        default: true
    },
    comprador: {
        type: String,
        required: [true, 'Es necesario un comprador al producto']
    }

});

productoShema.plugin(uniqueValidator, { message: '{PATH} Esta fruta ya fue registrada' })
module.exports = mongoose.model('Producto', productoShema)
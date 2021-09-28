const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let uniqueValidator = require('mongoose-unique-validator'); //esto primero se instala

const productovSchema = new Schema({

    nombre: {
        type: String,
        required: [true, 'El precio de necesario'],
        unique: true
    },
    precioUni: {
        type: Number,
        required: [true, 'El precio es necesario ']
    },
    desc: {
        type: String,
        required: false
    },
    disponible: {
        type: Boolean,
        default: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'Categoria'
    },
    img: {
        type: String,
        required: false
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }


})

productovSchema.plugin(uniqueValidator, { message: '{PATH} ya fue registrada' })
module.exports = mongoose.model('Productov', productovSchema);
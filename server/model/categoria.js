const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let categoriaShema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    desc: {
        type: String,
        required: [true, 'La descripción es necesaria ']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario', //nombre del modelo a que le quieres extrael el usuario
    }



});


module.exports = mongoose.model('Categoria', categoriaShema);
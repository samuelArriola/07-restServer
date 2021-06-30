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
    id_user: Schema.Types.ObjectId,



});


module.exports = mongoose.model('Categoria', categoriaShema);
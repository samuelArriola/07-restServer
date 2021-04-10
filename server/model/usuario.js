const mongoose = require('mongoose');
let uniqueValidator = require('mongoose-unique-validator'); //uso va validar los campos unicos 
let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: 'no es un rol valido'
}

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'es necesario ingresar el nombre']
    },
    email: {
        type: String,
        unique: true, //campo unico
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos //solo valores que adminte el  campo 
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }

});

//toJASON: metodo que se llama para imprimir
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password; //al imprimirse no se mostrara
    return userObject;
}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} Debe se unico, es decir, no se puede repetir' });

module.exports = mongoose.model('Usuario', usuarioSchema);
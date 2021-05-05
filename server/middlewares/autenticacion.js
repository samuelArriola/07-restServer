const jwt = require('jsonwebtoken');


/* let verificaToken = (req, res, next) => {
    const token = req.header('token');

    if (!token)
        return res.status(401).json({ ok: false, err: 'Token Not Found' });

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) return res.status(401).json({ ok: false, err: 'Invalid Token' });
        req.usuario = decoded;
        next();
    });
};
 */

//verificar el token 

let verificaToken = (req, res, next) => {
    let token = req.get('token'); //obtener token desde header 
    // console.log(token);

    //verificamos el que el token sea el correcto, esta funsion es propia de jwt
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (!token) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'no exite token para este usuario vuelva a logearse'
                }
            });
        }
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        //te permito aceder a la informacion
        req.usuario = decoded.usuario;
        // req.usuario = decoded.usuario; asi es como esta en le video no me salen las variables 

        next(); //sigue ejecutando el codigo depues deque el middleware sea correcto
    })

}

let verifica_usuario = (req, res, next) => {
    let { role } = req.usuario;
    console.log(role);
    if (role !== "ADMIN_ROLE") {
        return res.status(400).json({
            ok: false,
            err: {
                meassage: 'Este usuario no contiene los privilegios para esta operacion'
            }
        });
    }
    next();
}


module.exports = {
    verificaToken,
    verifica_usuario
}
require('./config/config');
const express = require('express');
const app = express();

// app.set('port', process.env.PORT || 3000);
app.use(express.json());

app.get('/user', (req, res) => {
    res.json('obtengo usuario');
})

app.post('/user', (req, res) => {

    res.json({
        persona: req.body
    });
})

app.put('/user/:id', (req, res) => {
    let { id } = req.params;
    res.json(`Actualiza datos el patch hace lo mismo ${id}`);
})

app.delete('/user/:id', (req, res) => {
    let { id } = req.params;
    let body = req.body.id
    if (body === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'se quiere el id'
        });
    } else {

    }
    res.json('Eliminar pero realmente se cambia el estado');
})

app.listen(process.env.PORT, () => {
    console.log(`listen on ${process.env.PORT}`);
})
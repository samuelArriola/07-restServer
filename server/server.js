require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// app.set('port', process.env.PORT || 3000);
app.use(express.json());
app.use(require('./router/usuario'));



mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    (err, res) => {
        if (err) throw err;
        console.log('base de daos online');

    });

app.listen(process.env.PORT, () => {
    console.log(`listen on ${process.env.PORT}`);
})
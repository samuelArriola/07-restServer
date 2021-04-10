// Para definir las variables que vamos a usar tanto local como de produción
//tambien se colocan variable global

//PUERTO
process.env.PORT = process.env.PORT || 3000;

//para saber en que lugar esta trabajando 
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;
//entorno: definimos la ruta de conecion dependiendo si trbajos local o en la nube
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URL; //ESTA VARIABLE DE EENTORNO LA CREO EN MI HOSTIN PARA QUE NO SEA VISIBLE AQUI
}

//creamon un envairoment para almacenar la conexion 
process.env.URLDB = urlDB;
const msql = require('mysql2');
require('dotenv').config();

const connection = msql.createConnection({ //TOMA LAS CREDENCIALES DEL SCRIPT.DB POR MEDIO DE .ENV QUE CONSIDERA PARA LA CONEXION
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

connection.connect( err =>{
    if(err){
        console.log('❌ Error al conectar a MySQL:', err);
        return;
    }
    console.log('✅ Conectado a MySQL correctamente');
});

module.exports = connection;
const express = require('express');
const router = express.Router();
const db = require('../db'); //Importamos la conexión a MySQL

// Obtenemos todos los pacientes
router.get('/', (req, res) => {
    db.query(
        `SELECT  id_paciente, nombre1, nombre2,  apellido1, apellido2, apellido_casado, DATE_FORMAT(fecha_nacimiento, '%Y-%m-%d') as fecha_nacimiento,
            direccion, telefono, genero, fecha_registro  FROM pacientes`, 
        (err, results) => {
            if(err) {
                console.error('Error obteniendo pacientes: ', err);
                return res.status(500).json({ error: 'Error obteniendo pacientes'});
            }
            
            // Formatear fecha_registro para consistencia
            const formattedResults = results.map(paciente => ({
                ...paciente,
                fecha_registro: paciente.fecha_registro.toISOString() // o formato personalizado
            }));
            
            res.json(formattedResults);
        }
    );
});

// Obtener un paciente por ID
router.get('/:id', (req, res) => {
    const {id} = req.params;
    db.query(
        `SELECT id_paciente,  nombre1,nombre2, apellido1, apellido2, apellido_casado, DATE_FORMAT(fecha_nacimiento, '%Y-%m-%d') as fecha_nacimiento,
            direccion, telefono, genero, fecha_registro FROM pacientes  WHERE id_paciente = ?`,   [id],   (err, results) => {
            if(err) {
                console.error('Error obteniendo paciente:', err);
                return res.status(500).json({ error: 'Error obteniendo paciente'});
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Paciente no encontrado'});
            }
               // Formatear la fecha de registro
            const paciente = {
                ...results[0],
                fecha_registro: results[0].fecha_registro.toISOString()
            };
            
            res.json(paciente);
        }
    );
});

//Agregar un nuevo paciente
router.post('/', (req,res)=>{
    const { nombre1, nombre2, apellido1, apellido2, apellido_casado, fecha_nacimiento, direccion, telefono, genero } = req.body;

    if (!nombre1 || !apellido1 || !fecha_nacimiento || !genero) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }
    const sql = 'INSERT INTO pacientes (nombre1, nombre2, apellido1, apellido2, apellido_casado, fecha_nacimiento, direccion, telefono, genero) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [nombre1, nombre2, apellido1, apellido2, apellido_casado, fecha_nacimiento, direccion, telefono, genero];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error insertando paciente:', err);
            return res.status(500).json({ error: 'Error insertando paciente' });
        }
        res.json({ message: 'Paciente agregado correctamente', id: result.insertId });
    });
});

// 🔹 Actualizar un paciente
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nombre1, nombre2, apellido1, apellido2, apellido_casado, fecha_nacimiento, direccion, telefono, genero } = req.body;

    const sql = 'UPDATE pacientes SET nombre1=?, nombre2=?, apellido1=?, apellido2=?, apellido_casado=?, fecha_nacimiento=?, direccion=?, telefono=?, genero=? WHERE id_paciente=?';
    const values = [nombre1, nombre2, apellido1, apellido2, apellido_casado, fecha_nacimiento, direccion, telefono, genero, id];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error actualizando paciente:', err);
            return res.status(500).json({ error: 'Error actualizando paciente' });
        }
        
        if (result.affectedRows === 0) {  // <<--- Verificamos si realmente se actualizó algo
            return res.status(404).json({ error: 'Paciente no encontrado' });
        }
        
        res.json({ message: 'Paciente actualizado correctamente' });
    });
});

// 🔹 Eliminar un paciente
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    // Primero verificamos si existe
    db.query('SELECT 1 FROM pacientes WHERE id_paciente = ?', [id], (err, results) => {
        if (err) {
            console.error('Error verificando paciente:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Paciente no encontrado' });
        }
        
        // Si existe, procedemos a eliminar
        db.query('DELETE FROM pacientes WHERE id_paciente = ?', [id], (err, result) => {
            if (err) {
                console.error('Error eliminando paciente:', err);
                return res.status(500).json({ error: 'Error eliminando paciente' });
            }
            res.json({ message: 'Paciente eliminado correctamente' });
        });
    });
});

module.exports = router;
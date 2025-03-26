const express = require('express');
const router = express.Router();
const db = require('../db'); // Importamos la conexión a MySQL

// 🔹 Obtener todos los tratamientos
router.get('/', (req, res) => {
    db.query('SELECT * FROM tratamiento', (err, results) => {
        if (err) {
            console.error('Error obteniendo tratamientos:', err);
            return res.status(500).json({ error: 'Error obteniendo tratamientos' });
        }
        res.json(results);
    });
});

// 🔹 Obtener tratamientos por ID de consulta
router.get('/consulta/:id_consulta', (req, res) => {
    const { id_consulta } = req.params;
    db.query('SELECT * FROM tratamiento WHERE id_consulta = ?', [id_consulta], (err, results) => {
        if (err) {
            console.error('Error obteniendo tratamientos:', err);
            return res.status(500).json({ error: 'Error obteniendo tratamientos' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'No hay tratamientos para esta consulta' });
        }
        res.json(results);
    });
});

// 🔹 Agregar un nuevo tratamiento
router.post('/', (req, res) => {
    const { id_consulta, descripcion } = req.body;

    if (!id_consulta || !descripcion) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    // Verificar si la consulta existe
    db.query('SELECT id_consulta FROM consultas WHERE id_consulta = ?', [id_consulta], (err, results) => {
        if (err) {
            console.error('Error verificando consulta:', err);
            return res.status(500).json({ error: 'Error verificando consulta' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'ID de consulta no registrado' });
        }

        // Insertar el tratamiento
        const sql = `INSERT INTO tratamiento (id_consulta, descripcion) VALUES (?, ?)`;
        db.query(sql, [id_consulta, descripcion], (err, result) => {
            if (err) {
                console.error('Error insertando tratamiento:', err);
                return res.status(500).json({ error: 'Error insertando tratamiento' });
            }
            res.json({ message: 'Tratamiento agregado correctamente', id: result.insertId });
        });
    });
});

// 🔹 Actualizar un tratamiento
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { descripcion } = req.body;

    if (!descripcion) {
        return res.status(400).json({ error: 'Debe proporcionar una descripción' });
    }

    const sql = 'UPDATE tratamiento SET descripcion=? WHERE id_tratamiento=?';
    db.query(sql, [descripcion, id], (err, result) => {
        if (err) {
            console.error('Error actualizando tratamiento:', err);
            return res.status(500).json({ error: 'Error actualizando tratamiento' });
        }
        res.json({ message: 'Tratamiento actualizado correctamente' });
    });
});

// 🔹 Eliminar un tratamiento
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM tratamiento WHERE id_tratamiento = ?', [id], (err, result) => {
        if (err) {
            console.error('Error eliminando tratamiento:', err);
            return res.status(500).json({ error: 'Error eliminando tratamiento' });
        }
        res.json({ message: 'Tratamiento eliminado correctamente' });
    });
});

module.exports = router;

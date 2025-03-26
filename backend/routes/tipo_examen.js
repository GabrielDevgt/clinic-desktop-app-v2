const express = require('express');
const router = express.Router();
const db = require('../db'); // Importamos la conexión a MySQL

// 🔹 Obtener todos los tipos de examen
router.get('/', (req, res) => {
    db.query('SELECT * FROM tipo_examen', (err, results) => {
        if (err) {
            console.error('Error obteniendo tipos de examen:', err);
            return res.status(500).json({ error: 'Error obteniendo tipos de examen' });
        }
        res.json(results);
    });
});

// 🔹 Obtener un tipo de examen por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM tipo_examen WHERE id_tipo_examen = ?', [id], (err, results) => {
        if (err) {
            console.error('Error obteniendo tipo de examen:', err);
            return res.status(500).json({ error: 'Error obteniendo tipo de examen' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Tipo de examen no encontrado' });
        }
        res.json(results[0]);
    });
});

// 🔹 Agregar un nuevo tipo de examen
router.post('/', (req, res) => {
    const { nombre_examen } = req.body;

    if (!nombre_examen) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const sql = `INSERT INTO tipo_examen (nombre_examen) VALUES (?)`;
    db.query(sql, [nombre_examen], (err, result) => {
        if (err) {
            console.error('Error insertando tipo de examen:', err);
            return res.status(500).json({ error: 'Error insertando tipo de examen' });
        }
        res.json({ message: 'Tipo de examen agregado correctamente', id: result.insertId });
    });
});

// 🔹 Eliminar un tipo de examen (solo si no tiene exámenes asociados)
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.query('SELECT id_examen FROM examen_medico WHERE id_tipo_examen = ?', [id], (err, results) => {
        if (err) {
            console.error('Error verificando exámenes asociados:', err);
            return res.status(500).json({ error: 'Error verificando exámenes asociados' });
        }
        if (results.length > 0) {
            return res.status(400).json({ error: 'No se puede eliminar, hay exámenes asociados a este tipo' });
        }

        db.query('DELETE FROM tipo_examen WHERE id_tipo_examen = ?', [id], (err, result) => {
            if (err) {
                console.error('Error eliminando tipo de examen:', err);
                return res.status(500).json({ error: 'Error eliminando tipo de examen' });
            }
            res.json({ message: 'Tipo de examen eliminado correctamente' });
        });
    });
});

module.exports = router;

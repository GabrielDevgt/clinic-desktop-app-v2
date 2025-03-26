const express = require('express');
const router = express.Router();
const db = require('../db'); // Importamos la conexión a MySQL

// 🔹 Obtener todos los doctores
router.get('/', (req, res) => {
    db.query('SELECT * FROM doctores', (err, results) => {
        if (err) {
            console.error('Error obteniendo doctores:', err);
            return res.status(500).json({ error: 'Error obteniendo doctores' });
        }
        res.json(results);
    });
});

// 🔹 Obtener un doctor por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM doctores WHERE id_doctor = ?', [id], (err, results) => {
        if (err) {
            console.error('Error obteniendo doctor:', err);
            return res.status(500).json({ error: 'Error obteniendo doctor' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Doctor no encontrado' });
        }
        res.json(results[0]);
    });
});

// 🔹 Agregar un nuevo doctor
router.post('/', (req, res) => {
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const sql = `INSERT INTO doctores (nombre) VALUES (?)`;
    db.query(sql, [nombre], (err, result) => {
        if (err) {
            console.error('Error insertando doctor:', err);
            return res.status(500).json({ error: 'Error insertando doctor' });
        }
        res.json({ message: 'Doctor agregado correctamente', id: result.insertId });
    });
});

// 🔹 Actualizar un doctor
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, especialidad } = req.body;

    const sql = `UPDATE doctores SET nombre=?, especialidad=? WHERE id_doctor=?`;
    db.query(sql, [nombre, especialidad, id], (err, result) => {
        if (err) {
            console.error('Error actualizando doctor:', err);
            return res.status(500).json({ error: 'Error actualizando doctor' });
        }
        res.json({ message: 'Doctor actualizado correctamente' });
    });
});

// 🔹 Eliminar un doctor
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM doctores WHERE id_doctor = ?', [id], (err, result) => {
        if (err) {
            console.error('Error eliminando doctor:', err);
            return res.status(500).json({ error: 'Error eliminando doctor' });
        }
        res.json({ message: 'Doctor eliminado correctamente' });
    });
});

module.exports = router;

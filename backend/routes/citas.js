const express = require('express');
const router = express.Router();
const db = require('../db');

// 🔹 Obtener todas las citas
router.get('/', (req, res) => {
    db.query('SELECT * FROM citas', (err, results) => {
        if (err) {
            console.error('Error obteniendo citas:', err);
            return res.status(500).json({ error: 'Error obteniendo citas' });
        }
        res.json(results);
    });
});

// 🔹 Obtener una cita por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM citas WHERE id_citas = ?', [id], (err, results) => {
        if (err) {
            console.error('Error obteniendo cita:', err);
            return res.status(500).json({ error: 'Error obteniendo cita' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }
        res.json(results[0]);
    });
});

// 🔹 Agregar una nueva cita (Verificando Paciente, Consulta y Doctor)
router.post('/', (req, res) => {
    const { id_paciente, id_consulta, id_doctor, proxima_cita } = req.body;

    // Validaciones básicas
    if (!id_paciente || !id_consulta || !id_doctor || !proxima_cita) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    // Validar formato de fecha y que sea futura
    if (!isValidFutureDateTime(proxima_cita)) {
        return res.status(400).json({ 
            error: 'Fecha inválida. Debe ser una fecha futura con formato YYYY-MM-DD HH:MM (o similar)' 
        });
    }

    // Formatear fecha para la base de datos
    const fechaFormateada = formatDateForDB(proxima_cita);

    // Verificar existencia de relaciones
    const checkSQL = `
        SELECT 
            (SELECT COUNT(*) FROM pacientes WHERE id_paciente = ?) AS pacienteExiste,
            (SELECT COUNT(*) FROM consultas WHERE id_consulta = ?) AS consultaExiste,
            (SELECT COUNT(*) FROM doctores WHERE id_doctor = ?) AS doctorExiste
    `;
    
    db.query(checkSQL, [id_paciente, id_consulta, id_doctor], (err, results) => {
        if (err) {
            console.error('Error verificando datos:', err);
            return res.status(500).json({ error: 'Error verificando datos' });
        }

        const { pacienteExiste, consultaExiste, doctorExiste } = results[0];

        if (!pacienteExiste) return res.status(404).json({ error: 'ID de paciente no registrado' });
        if (!consultaExiste) return res.status(404).json({ error: 'ID de consulta no registrado' });
        if (!doctorExiste) return res.status(404).json({ error: 'ID de doctor no registrado' });

        // Insertar la cita
        const sql = `INSERT INTO citas (id_paciente, id_consulta, id_doctor, proxima_cita) VALUES (?, ?, ?, ?)`;
        const values = [id_paciente, id_consulta, id_doctor, fechaFormateada];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error('Error insertando cita:', err);
                return res.status(500).json({ error: 'Error insertando cita' });
            }
            res.json({ 
                message: 'Cita agregada correctamente', 
                id: result.insertId 
            });
        });
    });
});

// 🔹 Actualizar una cita (mejorado)
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { id_paciente, id_consulta, id_doctor, proxima_cita } = req.body;

    // Validación básica
    if (!proxima_cita && !id_paciente && !id_consulta && !id_doctor) {
        return res.status(400).json({ error: 'Debe proporcionar al menos un campo para actualizar' });
    }

    if (proxima_cita && !isValidFutureDateTime(proxima_cita)) {
        return res.status(400).json({ 
            error: 'Fecha inválida. Debe ser una fecha futura con formato YYYY-MM-DD HH:MM (o similar)' 
        });
    }

    // Verificar si la cita existe primero
    db.query('SELECT id_citas FROM citas WHERE id_citas = ?', [id], (err, results) => {
        if (err) {
            console.error('Error verificando cita:', err);
            return res.status(500).json({ error: 'Error verificando cita' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }

        // Verificar relaciones si se proporcionan
        const checks = [];
        if (id_paciente) checks.push(checkRelation('pacientes', 'id_paciente', id_paciente));
        if (id_consulta) checks.push(checkRelation('consultas', 'id_consulta', id_consulta));
        if (id_doctor) checks.push(checkRelation('doctores', 'id_doctor', id_doctor));

        Promise.all(checks)
            .then(() => {
                // Construir consulta dinámica
                let sql = 'UPDATE citas SET ';
                const values = [];
                let updates = [];
                
                if (proxima_cita) {
                    updates.push('proxima_cita = ?');
                    values.push(formatDateForDB(proxima_cita));
                }
                if (id_paciente) {
                    updates.push('id_paciente = ?');
                    values.push(id_paciente);
                }
                if (id_consulta) {
                    updates.push('id_consulta = ?');
                    values.push(id_consulta);
                }
                if (id_doctor) {
                    updates.push('id_doctor = ?');
                    values.push(id_doctor);
                }
                
                sql += updates.join(', ') + ' WHERE id_citas = ?';
                values.push(id);

                db.query(sql, values, (err, result) => {
                    if (err) {
                        console.error('Error actualizando cita:', err);
                        return res.status(500).json({ error: 'Error actualizando cita' });
                    }
                    res.json({ message: 'Cita actualizada correctamente' });
                });
            })
            .catch(error => {
                res.status(404).json({ error: error.message });
            });
    });
});

// 🔹 Eliminar una cita (mejorado)
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    // Verificar existencia primero
    db.query('SELECT id_citas FROM citas WHERE id_citas = ?', [id], (err, results) => {
        if (err) {
            console.error('Error verificando cita:', err);
            return res.status(500).json({ error: 'Error verificando cita' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }

        // Proceder a eliminar
        db.query('DELETE FROM citas WHERE id_citas = ?', [id], (err, result) => {
            if (err) {
                console.error('Error eliminando cita:', err);
                return res.status(500).json({ error: 'Error eliminando cita' });
            }
            res.json({ message: 'Cita eliminada correctamente' });
        });
    });
});

// Helper para verificar relaciones
function checkRelation(table, field, id) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT ${field} FROM ${table} WHERE ${field} = ?`, [id], (err, results) => {
            if (err) {
                console.error(`Error verificando ${table}:`, err);
                reject(new Error(`Error verificando ${table}`));
            }
            if (results.length === 0) {
                reject(new Error(`ID de ${table} no registrado`));
            }
            resolve();
        });
    });
}

// Validar formato de fecha más flexible pero que sea futura
function isValidFutureDateTime(dateTime) {
    // Intentar parsear la fecha
    const date = new Date(dateTime);
    
    // Verificar que la fecha sea válida
    if (isNaN(date.getTime())) {
        return false;
    }
    
    // Verificar que tenga al menos día, mes, año y hora
    const timePart = dateTime.toString().split(/\D/).filter(Boolean);
    if (timePart.length < 4) { // Debe tener año, mes, día y al menos hora
        return false;
    }
    
    // Verificar que la fecha no sea en el pasado
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Comparar solo fecha, no hora
    
    return date >= now;
}

// Formatear fecha para MySQL (YYYY-MM-DD HH:MM:SS)
function formatDateForDB(dateTime) {
    const date = new Date(dateTime);
    const pad = num => num.toString().padStart(2, '0');
    
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

module.exports = router;
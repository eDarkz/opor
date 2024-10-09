import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: "srv1098.hstgr.io",
  user: "u856778635_opportunity",
  password: "J|7cB8]VkFp",
  database: "u856778635_opportunity",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.get('/api/reports', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM oportunidades ORDER BY fecha_creacion DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/reports/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM oportunidades WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'Report not found' });
    } else {
      const [updates] = await pool.query('SELECT * FROM actualizaciones_oportunidad WHERE oportunidad_id = ? ORDER BY fecha_actualizacion DESC', [req.params.id]);
      const report = { ...rows[0], updates };
      res.json(report);
    }
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/reports', async (req, res) => {
  try {
    const { nombre, numero_habitacion, agencia, departamento, folio, reportadopor, fecha_entrada, fecha_salida, estado_oportunidad, estado_animo, descripcion_reporte } = req.body;
    const [result] = await pool.query(
      'INSERT INTO oportunidades (nombre, numero_habitacion, agencia, departamento, folio, reportadopor, fecha_entrada, fecha_salida, estado_oportunidad, estado_animo, descripcion_reporte) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [nombre, numero_habitacion, agencia, departamento, folio, reportadopor, fecha_entrada, fecha_salida, estado_oportunidad, estado_animo, descripcion_reporte]
    );
    res.status(201).json({ id: result.insertId, message: 'Report created successfully' });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/reports/:id', async (req, res) => {
  try {
    const { nombre, numero_habitacion, agencia, departamento, folio, reportadopor, fecha_entrada, fecha_salida, estado_oportunidad, estado_animo, descripcion_reporte } = req.body;
    await pool.query(
      'UPDATE oportunidades SET nombre = ?, numero_habitacion = ?, agencia = ?, departamento = ?, folio = ?, reportadopor = ?, fecha_entrada = ?, fecha_salida = ?, estado_oportunidad = ?, estado_animo = ?, descripcion_reporte = ? WHERE id = ?',
      [nombre, numero_habitacion, agencia, departamento, folio, reportadopor, fecha_entrada, fecha_salida, estado_oportunidad, estado_animo, descripcion_reporte, req.params.id]
    );
    res.json({ message: 'Report updated successfully' });
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/reports/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM oportunidades WHERE id = ?', [req.params.id]);
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/reports/:id/updates', async (req, res) => {
  try {
    const { actualizacion } = req.body;
    await pool.query(
      'INSERT INTO actualizaciones_oportunidad (oportunidad_id, actualizacion) VALUES (?, ?)',
      [req.params.id, actualizacion]
    );
    res.status(201).json({ message: 'Update added successfully' });
  } catch (error) {
    console.error('Error adding update:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/reports/:reportId/updates/:updateId', async (req, res) => {
  try {
    await pool.query('DELETE FROM actualizaciones_oportunidad WHERE id = ? AND oportunidad_id = ?', [req.params.updateId, req.params.reportId]);
    res.json({ message: 'Update deleted successfully' });
  } catch (error) {
    console.error('Error deleting update:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
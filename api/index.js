require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.API_PORT || 4000;
const cors = require('cors');

// Middleware para parsear JSON
app.use(bodyParser.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  credentials: true
}));

const pool = new Pool({
  user: "admin",
  host: '137.184.58.132',
  database: "stackcomposer",
  password: "admin1234",
  port: "1000",
});

// Crear tabla si no existe
const createLeadsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Tabla "leads" verificada/creada');
  } catch (err) {
    console.error('Error creando tabla:', err);
  }
};

// Verificar conexión a la base de datos y crear tabla al iniciar
pool.connect(async (err, client, release) => {
  if (err) {
    return console.error('Error obteniendo cliente de pool:', err);
  }
  
  try {
    // Verificar conexión
    await client.query('SELECT NOW()');
    console.log('Conexión a PostgreSQL establecida');
    
    // Crear tabla leads
    await createLeadsTable();
  } catch (err) {
    console.error('Error en consulta inicial:', err);
  } finally {
    release();
  }
});

// Endpoint de salud
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    res.status(200).send('API + DB OK');
  } catch (err) {
    res.status(500).send('DB connection error');
  }
});

// Ruta para obtener leads
app.get('/leads', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM leads ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error obteniendo leads' });
  }
});

// Ruta para crear un nuevo lead
app.post('/leads', async (req, res) => {
  const { name, email, phone } = req.body;
  
  // Validación básica
  if (!name || !email) {
    return res.status(400).json({ error: 'Nombre y email son requeridos' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO leads (name, email, phone) VALUES ($1, $2, $3) RETURNING *',
      [name, email, phone || null]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    
    // Manejar error de duplicado de email
    if (err.code === '23505') {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }
    
    res.status(500).json({ error: 'Error creando lead' });
  }
});

// Ruta para obtener un lead por ID
app.get('/leads/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('SELECT * FROM leads WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lead no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error obteniendo lead' });
  }
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Error interno del servidor');
});

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});

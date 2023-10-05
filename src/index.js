const express = require('express');
const rotas = require('./rotas');
const cors = require('cors');
const app = express();
require('dotenv').config();
app.use(express.json());
app.use(cors());
app.use(rotas);

const port = process.env.PORT;

app.listen(port, () => console.log(`Servidor na porta: ${port}`));
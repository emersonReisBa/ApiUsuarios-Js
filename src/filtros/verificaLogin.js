const knex = require('../conexao');
const jwt = require('jsonwebtoken');
const senhaHash = require('../senhaHash');


const verificaLogin = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json('Não autorizado');
    }

    const token = authorization.replace('Bearer', '').trim();
    try {

        const { id } = jwt.verify(token, senhaHash);

        const usuario = await knex('usuarios').where({ id }).first();

        if (!usuario) {
            return res.status(404).json('Usuario não encontrado');
        }

        req.usuario = usuario;
        next();
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = verificaLogin
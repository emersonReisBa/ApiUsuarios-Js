const knex = require("../conexao");

const listarProdutos = async (req, res) => {
  const { id } = req.usuario;
  const { categoria } = req.query;

  try {
    if (categoria) {
      const listarProdutos = await knex("produtos").where(
        "categoria",
        "=",
        categoria
      );

      return res.status(200).json(listarProdutos);
    }
    const listarProdutos = await knex("produtos").where("usuario_id", "=", id);

    return res.status(200).json(listarProdutos);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const obterProduto = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const obterProduto = await knex("produtos").where({ id }).debug();

    if (obterProduto === 0) {
      return res.status(404).json("Produto não encontrado");
    }

    return res.status(200).json(obterProduto);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const cadastrarProduto = async (req, res) => {
  const { id } = req.usuario;
  const { nome, estoque, preco, categoria, descricao, imagem } = req.body;
  if (!nome) {
    return res.status(404).json("O campo nome é obrigatório");
  }

  if (!estoque) {
    return res.status(404).json("O campo estoque é obrigatório");
  }

  if (!preco) {
    return res.status(404).json("O campo preco é obrigatório");
  }

  if (!descricao) {
    return res.status(404).json("O campo descricao é obrigatório");
  }

  try {
    const quantidadeProdutos = await knex("produtos").where({ nome });

    if (quantidadeProdutos > 0) {
      return res.status(400).json("O produto já existe");
    }

    const cadastrarProduto = await knex("produtos")
      .insert({
        usuario_id: id,
        nome,
        estoque,
        preco,
        categoria,
        descricao,
        imagem,
      })
      .returning("*");
    if (cadastrarProduto.length === 0) {
      return res.status(400).json("O produto não foi cadastrado.");
    }
    return res.status(200).json("O produto foi cadastrado com sucesso!");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const atualizarProduto = async (req, res) => {
  const { idUsuario } = req.usuario;
  const { id } = req.params;
  const { nome, estoque, preco, categoria, descricao, imagem } = req.body;

  if (!nome && !estoque && !preco && !categoria && !descricao && !imagem) {
    return res
      .status(404)
      .json("Informe ao menos um campo para atualizaçao do produto");
  }

  try {
    const produtoExiste = await knex("produtos").where({ id }).first();

    if (produtoExiste === 0) {
      return res.status(400).json("O produto não existe ");
    }

    const atualizarProduto = await knex("produtos")
      .update({
        nome: nome || produtoExiste.nome,
        estoque: estoque || produtoExiste.estoque,
        preco: preco || produtoExiste.preco,
        categoria: categoria || produtoExiste.categoria,
        descricao: descricao || produtoExiste.categoria,
        imagem: imagem || produtoExiste.imagem,
      })
      .where({ id });

    if (atualizarProduto === 0) {
      return res.status(400).json("O produto não foi atualizado");
    }

    return res.status(200).json("produto foi atualizado com sucesso.");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const excluirProduto = async (req, res) => {
  const { idUsuario } = req.usuario;
  const { id } = req.params;

  try {
    const excluirProduto = await knex("produtos").del().where({ id });

    if (excluirProduto === 0) {
      return res.status(400).json("O produto não foi excluido");
    }
    return res.status(200).json("Produto excluido com sucesso");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  listarProdutos,
  obterProduto,
  cadastrarProduto,
  atualizarProduto,
  excluirProduto,
};

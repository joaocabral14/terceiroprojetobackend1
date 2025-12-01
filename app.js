const express = require('express');
const { createClient } = require('@supabase/supabase-js'); // Correção da importação
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Configuração CORS
const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200
};
app.use(cors(corsOptions));

// Logs HTTP
app.use(morgan('combined'));

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Instancia do Supabase
const supabase = createClient(
  'https://pwbsewvqxzenmgeceuay.supabase.co', 
  'sb_publishable_VU_cskfKTik4MSXWSkER2A_WjYVBGwf'
);

// ======================
// ROTAS
// ======================

// Lista todos os produtos
app.get('/products', async (req, res) => {
  const { data, error } = await supabase.from('products').select();
  if (error) return res.status(500).json({ error });
  res.json(data);
  console.log('Todos os produtos:', data);
});

// Consulta produto por ID
app.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('products')
    .select()
    .eq('id', id)
    .single(); // Retorna apenas um produto

  if (error) return res.status(404).json({ error: 'Produto não encontrado' });
  res.json(data);
  console.log('Produto consultado:', data);
});

// Adiciona um produto
app.post('/products', async (req, res) => {
  const { name, description, price } = req.body;
  const { data, error } = await supabase
    .from('products')
    .insert({ name, description, price })
    .select()
    .single(); // Retorna o produto criado

  if (error) return res.status(500).json({ error });
  res.json(data);
  console.log('Produto criado:', data);
});

// Atualiza produto
app.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;
  const { data, error } = await supabase
    .from('products')
    .update({ name, description, price })
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ error });
  res.json(data);
  console.log('Produto atualizado:', data);
});

// Deleta produto
app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ error });
  res.json({ message: 'Produto deletado', data });
  console.log('Produto deletado:', id);
});

// Rota raiz
app.get('/', (req, res) => {
  res.send("Hello! Backend Supabase funcionando <3");
});

// Inicializa servidor
app.listen(3000, () => {
  console.log('> Servidor rodando em http://localhost:3000');
});

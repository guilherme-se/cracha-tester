const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware para fazer o parse do corpo das requisições
app.use(bodyParser.json());

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public','index.html')));   

// Servir o arquivo index.html na rota raiz
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'index.html');
    fs.readFile(indexPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo index.html:', err);
            res.status(500).send('Erro ao ler o arquivo index.html');
            return;
        }
        res.send(data);
    });
});

// Endpoint para salvar a imagem
app.post('/salvar-imagem', (req, res) => {
    const { nome, imagem } = req.body;

    // Decodifica a imagem base64
    const imageData = Buffer.from(imagem, 'base64');

    // Caminho onde a imagem será salva (pasta dentro do projeto)
    const caminho = path.join(__dirname, 'imagens', `${nome}.png`);

    // Salva a imagem no disco
    fs.writeFile(caminho, imageData, (err) => {
        if (err) {
            console.error('Erro ao salvar a imagem:', err);
            res.status(500).send('Erro ao salvar a imagem');
            return;
        }
        console.log('Imagem salva com sucesso:', caminho);
        res.send('Imagem salva com sucesso');
    });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

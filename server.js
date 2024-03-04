const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));

// Servindo arquivos estáticos
app.use(express.static('public'));

app.post('/salvar-imagem', (req, res) => {
    const imageData = req.body.imagem;
    const base64Data = imageData.replace(/^data:image\/png;base64,/, '');
    const nomeArquivo = req.body.nome || 'imagem_salva.png';
    const caminhoArquivo = path.join(__dirname, 'imagens', nomeArquivo);

    fs.writeFile(caminhoArquivo, base64Data, 'base64', (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao salvar a imagem');
        }
        res.send('Imagem salva com sucesso');
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

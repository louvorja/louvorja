const http = require("http");
const path = require("path");
const fs = require("fs");

const PORT = 7070;
const DIRECTORY = path.join(__dirname, "..", "files"); // Pasta a ser servida

// Função para adicionar cabeçalhos CORS
const setCorsHeaders = (res) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Permitir todas as origens
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS"); // Métodos permitidos
  res.setHeader("Access-Control-Allow-Headers", "Content-Type"); // Cabeçalhos permitidos
  res.setHeader("Content-Type", "text/html; charset=utf-8");
};

// Função para lidar com as requisições
const requestHandler = (req, res) => {
  // Lidar com requisições OPTIONS (pré-flight CORS)
  if (req.method === "OPTIONS") {
    setCorsHeaders(res);
    res.writeHead(204); // Sem conteúdo
    res.end();
    return;
  }

  // Adicionar cabeçalhos CORS para outras requisições
  setCorsHeaders(res);

  const filePath = path.join(
    DIRECTORY,
    decodeURIComponent(req.url).split("?")[0]
  );
  console.log("Diretório", filePath);

  // Impede acesso a diretórios fora da pasta "files"
  if (!filePath.startsWith(DIRECTORY)) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    res.end("Acesso negado");
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Arquivo nao encontrado");
      return;
    }

    if (stats.isDirectory()) {
      fs.readdir(filePath, { encoding: "utf8" }, (err, files) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Erro ao ler diretorio");
          return;
        }

        const list = files
          .map(
            (file) =>
              `<li><a href="${path.join(
                req.url,
                encodeURIComponent(file)
              )}">${file}</a></li>`
          )
          .join("");
        const html = `
          <html>
            <head>
              <meta charset="UTF-8">
              <title>Arquivos em ${req.url}</title>
            </head>
            <body>
              <h1>Arquivos em ${req.url}</h1>
              <ul>${list}</ul>
            </body>
          </html>
        `;
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(html);
      });
      return;
    }

    // Serve o arquivo
    const stream = fs.createReadStream(filePath);
    res.writeHead(200);
    stream.pipe(res);
    stream.on("error", () => {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Erro interno no servidor");
    });
  });
};

// Cria o servidor HTTP
const server = http.createServer(requestHandler);

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

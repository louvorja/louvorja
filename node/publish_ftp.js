const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.development" });

const outputZipDir = path.resolve(__dirname, "../tmp");
const outputZip = path.join(outputZipDir, "dist.zip");

fs.unlink(outputZip, (err) => {
  if (err) {
    console.error("Erro ao apagar o arquivo:", err);
  } else {
    console.log("Arquivo apagado com sucesso:", outputZip);
  }
});

// URL para acionar
const url = process.env.FTP_URL_DEPLOY;

async function triggerPublish() {
  try {
    // Envia a requisição GET para a URL
    const response = await fetch(url);

    // Verifica se a requisição foi bem-sucedida
    if (response.ok) {
      console.log("Requisição bem-sucedida:", response.status);
    } else {
      console.error("Erro na requisição:", response.status);
    }
  } catch (error) {
    console.error("Erro ao acionar a URL:", error);
  }
}

// Chama a função
triggerPublish();

const ftp = require("basic-ftp");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.development" });

async function uploadToFTP() {
  const client = new ftp.Client();
  client.ftp.verbose = true; // Opcional: exibe logs no console para depuração

  // Configurações do servidor FTP
  const ftpConfig = {
    host: process.env.FTP_HOST,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASSWORD,
  };

  // Caminho do arquivo local e remoto
  const localFile = path.join(path.resolve(__dirname, "../tmp"), "dist.zip"); // Arquivo local para enviar
  const remotePath = process.env.FTP_DIR + "/dist.zip"; // Caminho remoto no servidor

  try {
    console.log("Conectando ao servidor FTP...");
    await client.access(ftpConfig);

    console.log("Enviando arquivo...");
    await client.uploadFrom(localFile, remotePath);

    console.log("Arquivo enviado com sucesso!");
  } catch (err) {
    console.error("Erro ao enviar arquivo para o servidor FTP:", err);
  } finally {
    client.close(); // Encerra a conexão
  }
}

uploadToFTP();

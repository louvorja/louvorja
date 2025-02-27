const fs = require("fs-extra");
const archiver = require("archiver");
const path = require("path");

// Caminhos
const distFolder = path.resolve(__dirname, "../dist");
const outputZipDir = path.resolve(__dirname, "../tmp");
const outputZip = path.join(outputZipDir, "dist.zip");

// Função para criar o ZIP
async function zipFolder() {
  try {
    // Verifica se a pasta dist existe
    if (!fs.existsSync(distFolder)) {
      console.error("A pasta 'dist' não existe.");
      return;
    }

    // Garante que o diretório para o ZIP existe
    await fs.ensureDir(outputZipDir);

    // Remove o arquivo ZIP anterior, se existir
    if (fs.existsSync(outputZip)) {
      console.log("Removendo ZIP antigo...");
      await fs.remove(outputZip);
    }

    // Cria o stream de saída
    const output = fs.createWriteStream(outputZip);
    const archive = archiver("zip", { zlib: { level: 9 } });

    // Escuta os eventos do stream de saída
    output.on("close", () => {
      console.log(`ZIP criado com sucesso: ${outputZip}`);
      console.log(`${archive.pointer()} bytes compactados.`);
    });

    archive.on("error", (err) => {
      throw err;
    });

    // Conecta o arquivo ZIP ao stream de saída
    archive.pipe(output);

    // Adiciona a pasta dist ao ZIP
    archive.directory(distFolder, false);

    // Finaliza o processo
    await archive.finalize();
  } catch (error) {
    console.error("Erro ao criar o ZIP:", error);
  }
}

// Executa a função
zipFolder();

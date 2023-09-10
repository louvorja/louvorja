const fs = require('fs');

// Caminho para o arquivo .ftp
const ftpConfigPath = '.ftp';

// Verifica se o arquivo .ftp existe
if (!fs.existsSync(ftpConfigPath)) {
    console.error(`O arquivo ${ftpConfigPath} não foi encontrado. Certifique-se de que ele existe na raiz do seu projeto.`);
    process.exit(1);
}

// Lê o arquivo .ftp de configuração
const ftpConfig = fs.readFileSync(ftpConfigPath, 'utf-8');

// Parse das informações do arquivo .ftp
const ftpInfo = ftpConfig.split('\n').reduce((info, line) => {
    const [key, value] = line.split('=');
    info[key.trim()] = value.trim();
    return info;
}, {});

// Verifica se todas as informações necessárias estão presentes
if (!ftpInfo.HOST) {
    console.error('HOST não encontrado no arquivo ftp.');
    process.exit(1);
}
if (!ftpInfo.USER) {
    console.error('USER não encontrado no arquivo ftp.');
    process.exit(1);
}
if (!ftpInfo.PASSWORD) {
    console.error('PASSWORD não encontrado no arquivo ftp.');
    process.exit(1);
}
if (!ftpInfo.PORT) {
    console.error('PORT não encontrado no arquivo ftp.');
    process.exit(1);
}
if (!ftpInfo.LOCAL_ROOT) {
    console.error('LOCAL_ROOT não encontrado no arquivo ftp.');
    process.exit(1);
}
if (!ftpInfo.REMOTE_ROOT) {
    console.error('REMOTE_ROOT não encontrado no arquivo ftp.');
    process.exit(1);
}

// *********************************************************************************** //

const FtpDeploy = require("ftp-deploy");

const config = {
    host: ftpInfo.HOST,
    user: ftpInfo.USER,
    password: ftpInfo.PASSWORD,
    port: +ftpInfo.PORT,
    localRoot: ftpInfo.LOCAL_ROOT,
    remoteRoot: ftpInfo.REMOTE_ROOT,
    include: ['*', '**/*'],
};

const config_show = { ...config };
delete config_show.password;

console.log("Dados FTP", config_show);

console.log("Iniciando transferência de arquivos...");

const ftpDeploy = new FtpDeploy();

ftpDeploy.deploy(config)
    .then(() => {
        console.log("Transferência de arquivos FTP concluída com sucesso!");
    })
    .catch((err) => {
        console.error("Erro ao transferir arquivos FTP:", err);
    });
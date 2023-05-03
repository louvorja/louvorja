FROM node:latest

# Instale as dependências do sistema necessárias
RUN apt-get update && apt-get install -y libgtk2.0-0 libgconf-2-4 libasound2 libxtst6 libxss1 libnss3 xvfb

# Defina o diretório de trabalho como a pasta do projeto
WORKDIR /app

# Copie os arquivos do projeto para o contêiner Docker
COPY . .

# Instale as dependências do projeto
RUN npm install

# Compile o aplicativo para a plataforma de destino (Linux)
RUN npm run build:linux

# ************************ INSTRUÇÕES PARA RODAR *************************
# docker build -t my-electron-app .
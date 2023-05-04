FROM node:latest

# Instale as dependências do sistema necessárias
RUN apt-get update && apt-get install -y libgtk2.0-0 libgconf-2-4 libasound2 libxtst6 libxss1 libnss3 xvfb

# Defina o diretório de trabalho como a pasta do projeto
WORKDIR /app

# Copie os arquivos do projeto para o contêiner Docker
COPY . .

# Instale as dependências do projeto
RUN npm install --verbose
#RUN npm install --verbose --force --legacy-peer-deps

# Compile o aplicativo para a plataforma de destino (Linux)
RUN npm run build:linux --verbose

# ************************ INSTRUÇÕES PARA RODAR *************************

# ** Criar a imagem Docker **
# docker build -t electron-app .

# ** Executar o contêiner Docker **
# docker run --rm -it -v $(pwd):/app electron-app

# ** Copiar esses arquivos para o seu host **
# docker cp [CONTAINER ID]:/app/dist/linux-unpacked .


# ************************ OUTRAS INSTRUÇÕES *************************

# ** Remover imagens e containers não utlizados **
# docker system prune

# ** Listar imagens **
# docker ps -a
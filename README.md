# LouvorJA

Software de projeção de letras de músicas com centenas de músicas do Hinário Adventista, CDs jovens e coletâneas diversas.

[Site oficial](https://louvorja.com.br/)

## Instalação e compilação do Projeto

Necessário ter o [Node](https://nodejs.org/)] instalado.

Após baixar o projeto em seu repositório local, executar o comando abaixo para instalar as dependências.
```
npm install
```

### Compilação para o ambiente de desenvolvimento
Para visualizar a versão web do projeto no ambiente de desenvolvimento, executar:
```
npm run serve
```

Para visualizar a versão desktop do projeto no ambiente de desenvolvimento, executar:
```
npm run electron:serve
```

### Compiles and minifies for production
Para compilar o projeto para o ambiente de produção, executar:
```
npm run build
```

Este comando irá gerar uma nova versão para o projeto, e gerar a versão de produção. Após este comando, executar o comando para gerar a versão desktop do projeto:
```
npm run electron:build
```

## Customização
O programa usa o framework [VueJS](https://cli.vuejs.org/), e a biblioteca [Vuetify](https://v2.vuetifyjs.com/), e na versão desktop, [ElectronJS](https://www.electronjs.org/). Consulte os sites para mais detalhes e ver toda a documentação.

## Estrutura
Os arquivos do projeto estão organizados na seguinte estrutura:

### Backend
Na pasta src/backend, estão as classes correspondentes a versão desktop, acessadas através do electronJs.

### Components
Na pasta src/components, estão os componentes visuais da aplicação, como botões, telas, campos, ícones, entre outros.

### Controllers
Na pasta src/controllers, estão os controladores que fazem a comunicação com o banco de dados. Os controladores acessam a classe DB.js, que por sua vez, estabalece se a comunicação com a API, definindo se a comunicação será através do banco de dados remoto (aplicação web), ou banco de dados local (aplicação desktop).

### Database
Na pasta src/database, estão os arquivos responsáveis por criar o servidor local do banco de dados. O servidor é inicializado através do arquivo server.js, que recebe as requisições, e passa para as respectivas tabelas (pasta tables).

### Helpers
Na pasta src/helpers, estão funções do projeto, responsáveis por todas as tarefas do sistema.

### Lang
Na pasta src/langs, estão os arquivos de tradução para cada idioma.

### Layout
Na pasta src/layout, estão as partes visuais que compõe o sistema.

### Plugins
Na pasta src/plugins, estão os arquivos responsáveis por instanciar e fazer a comunicação com os plugins do VueJS.

### Router
Na pasta src/router, estão todas as rotas do sistema. As rotas acionam os arquivos localizados na pasta views.

### Services
Na pasta src/services, estão as apis e serviços externos.

### Store
Na pasta src/store, estão armazenadas todas as variáveis globais da aplicação.

### View
Na pasta src/view, estão as telas acionadas através das rotas.

### Front-End
O arquivo App.vue, na pasta src, inicializa o front-end da aplicação.

### Back-End
O arquivo background.js, na pasta src, inicializa o back-end da aplicação. Esse arquivo só é executado na aplicação desktop, através do electronJS, fazendo toda a comunicação com o front da aplicação.


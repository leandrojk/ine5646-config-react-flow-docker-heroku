# UFSC-CTC-INE-INE5646 Programação para Web -- App Config React Flow - Versão Docker Heroku

Aplicação para demonstrar quais são os arquivos de configuração, no lado cliente e no lado servidor, que toda aplicação baseada em React, Bulma e Flow deve ter para poder rodar em um container docker cuja imagem será instalada no Heroku.

## Configuração no seu computador

O programa Docker Desktop precisa estar instalado e em execução na sua máquina. Acesse [https://www.docker.com/get-started](https://www.docker.com/get-started) para saber como fazer isso.

Se o VSCode for utilizado então é preciso instalar a extensão [Remote Development da Microsoft](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack).

Você também precisa criar uma conta no [Heroku](https://heroku.com) e instalar o programa `heroku` no seu computador. Acesse [https://devcenter.heroku.com/articles/heroku-cli#download-and-install](https://devcenter.heroku.com/articles/heroku-cli#download-and-install) para download do programa.

## Instruções

### Durante o desenvolvimento com VSCode

#### Preparação Inicial

Os procedimentos a seguir devem ser realizados uma única vez.

##### Configurando arquivo .env

Crie, no diretório raiz do projeto ***no seu computador local***, o arquivo **.env** com o seguinte conteúdo

```bash
SEGUNDOS_AGUARDANDO=2
LOCAL=sim
```

A variável de ambiente `SEGUNDOS_AGUARDANDO` define quantos segundos o lado servidor deve aguardar para enviar uma resposta ao lado cliente, simulando com isso um processamento demorado.

A variável de ambiente `LOCAL` é opcional e indica que a aplicação será executada localmente quando o seu valor for `sim`. Se ausente ou com outro valor considera-se que será executada via Heroku.

Quando o container é instalado no Heroku a variável `process.env.PORT`, definida pelo próprio Heroku,  conterá a porta usada pela aplicação.

O arquivo **.env** também poderia ser usado também para armazenar dados sigilosos como senhas, chaves, etc. Essas informações nunca devem ser armazenadas em locais públicos (como repositórios git ou repositórios de imagens docker).

#### Editando Remotamente

Entre no VSCode, clique em `Open a Remote Window` (canto inferior esquerdo) e selecione a opção `Remote-Containers: Open Folder in Container` e selecione a pasta que contém a aplicação.

##### Instalando bibliotecas JavaScript

Abra um terminal e instale as bibliotecas JavaScript usadas pelo lado cliente da aplicação:

```bash
cd cliente
npm install
```

Abra um terminal e instale as bibliotecas JavaScript usadas pelo lado servidor da aplicação:

```bash
cd servidor
npm install
```

#### Durante o desenvolvimento

Para colocar a aplicação no ar durante o seu desenvolvimento proceda da seguinte forma.

Abra um terminal e inicie a execução do lado cliente (os arquivos serão monitorados pelo webpack):

```bash
cd cliente
npm start
```

Abra um segundo terminal e inicie a execução do lado servidor (os arquivos serão monitorados pelo babel):

```bash
cd servidor
npm start
```

No VSCode, clique em *No Ports Available/Forward a Port* e clique na porta 3000. Isso fará que requisições enviadas para a porta 3000 sejam encaminhadas para a porta 3000 da aplicação rodando dentro do container.

A partir de agora altere os arquivos JavaScript como desejar.

### Em produção

Depois que a aplicação está pronta é preciso gerar "uma versão executável". Para isso é preciso gerar uma imagem e depois instanciar e executar um container a partir da imagem gerada.

#### Gerando a imagem

A imagem, aqui chamada de ***ine5646-app-demo*** conterá a versão executável da aplicação. Execute o seguinte comando para gerar a imagem (note que o comando termina com um ponto depois de ine5646-app-demo):

```bash
docker build -t ine5646-app-demo .
```

#### Executando a aplicação localmente

Crie ou utilize um arquivo chamado ***.env*** com o seguinte conteúdo:

```bash
SEGUNDOS_AGUARDANDO=2
LOCAL=sim
```

##### Executando localmente via docker-compose

A forma mais simples para gerar a imagem e instanciar e executar um container é usando o programa `docker-compose`. Na raiz do projeto digite:

`docker-compose up`

Os dados para gerar a imagem e executar o container são obtidos no arquivo de configuração `docker-compose.yml`.

Para encerrar o docker-compose tecle `Ctl-C`.

Uma alternativa, para liberar o terminal, é executar:

`docker-compose up -d`

e depois para encerrar executar:

`docker-compose down`

##### Executando localmente via docker run

Crie um container para executar a aplicação. Execute o seguinte comando para instanciar o container e colocá-lo no ar.

```bash
docker run -d --name ine5646-app-demo --rm -p 4000:3000 --env-file .env ine5646-app-demo
```

O primeiro número do parâmetro `-p 4000:3000` representa a porta usada pelo browser para acessar a aplicação. As requisições serão encaminhadas para a porta 3000 usada pela aplicação dentro do container. Assim, para acessar a aplicação, basta digitar `https://localhost:4000` no seu navegador. Naturalmente, a porta `4000` deve estar livre no computador.

Não há nada de especial com o valor 4000, poderia ser qualquer outro número, inclusive 3000 como em `-p 3000:3000`.

Como neste exemplo o arquivo *.env* só define duas variáveis obrigatórias uma forma alternativa de instanciar e executar um container seria definir o valor de `SEGUNDOS_AGUARDANDO` e de `LOCAL` diretamente:

```bash
docker run -d --name ine5646-app-demo -p 4000:3000 -e SEGUNDOS_AGUARDANDO=3 -e LOCAL=sim ine5646-app-demo
```

## Fazendo o deploy da imagem no Heroku

Depois que você conseguiu executar a aplicação no seu computador local a apartir da imagem gerada o próximo passo é disponibilizar a aplicação para acesso de qualquer pessoa via site do Heroku. Esse processo envolve duas etapas: 1) transferência da imagem docker para o Heroku; 2) configuração das variáveis de ambiente no Heroku.

### Transferindo a imagem docker para o Heroku

No exemplo a aplicação receberá o nome `ine5646-app-demo`. Este nome precisa ser único para todo o Heroku. Assim, se o comando `heroku create ...` indicar que o nome já existe você deve escolher outro nome. 

Execute os seguintes comandos em um terminal:

```bash
heroku container:login
heroku create  ine5646-app-demo  // se este nome já estiver sendo usado escolha outro
docker tag ine5646-app-demo registry.heroku.com/ine5646-app-demo/web
docker push registry.heroku.com/ine5646-app-demo/web
heroku container:release web -a ine5646-app-demo
```

### Definindo as variáveis de ambiente no Heroku

Depois que a imagem foi transferida para o Heroku proceda da seguinte forma:

1. Acesse [https://heroku.com](https://heroku.com) e faça login
2. Clique no nome da aplicação (no exemplo seria ine5646-app-demo)
3. Clique no menu *Settings*
4. Clique no botão *Reveal Config Vars*
5. Adicione todas as variáveis de ambiente que estão definidas no arquivo `.env`. No caso, apenas a variável SEGUNDOS_AGUARDANDO.

A partir de agora a aplicação pode ser acessada a partir de qualquer navegador no endereço `https://ine5646-app-demo.heroku.com`.

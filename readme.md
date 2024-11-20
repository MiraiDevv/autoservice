# Sistema de Gerenciamento de Serviços Automotivos

Este é um sistema para gerenciamento de ordens de serviço automotivas, com funcionalidades de cadastro, acompanhamento de status, registro de pagamentos e exportação de dados.

## 🔧 **Pré-requisitos**

Para rodar este projeto, você precisará ter instalado:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## 🚀 **Como Executar**

1. Descompacte o arquivo recebido em uma pasta de sua preferência.
2. Abra o terminal na pasta onde você descompactou o projeto.
3. Execute o comando:

   ```bash
   docker compose up 
   ou 
   docker-compose up
   ```

   Aguarde todos os serviços iniciarem. Você verá várias mensagens no terminal. Quando tudo estiver pronto, poderá acessar:

    - **Frontend:** [http://localhost:5173](http://localhost:5173)
    - **Backend:** [http://localhost:8080](http://localhost:8080)
    - **Serviço de Exportação:** [http://localhost:5000](http://localhost:5000)

## 📋 **Funcionalidades**

O sistema oferece:

- Cadastro de ordens de serviço
- Acompanhamento de status (Pendente/Pronto)
- Registro de pagamentos (Dinheiro/Cartão/PIX)
- Exportação de dados para CSV
- Pesquisa e filtros
- Paginação dos resultados

## ⚠️ **Observações Importantes**

- Não feche o terminal onde o `docker-compose` está rodando, pois isso irá parar a aplicação.
- Para parar a aplicação, use `Ctrl+C` no terminal ou execute `docker-compose down` em outro terminal.
- Os dados são persistidos no banco de dados mesmo após parar a aplicação.
- Em caso de problemas, tente parar completamente com `docker-compose down` e iniciar novamente com `docker-compose up`.

## ❓ **Possíveis Problemas e Soluções**

- **Se as portas já estiverem em uso:**
    - Verifique se não há outros serviços usando as portas `5173`, `8080` ou `5000`.
    - Pare esses serviços ou modifique as portas no arquivo `docker-compose.yml`.

- **Se o Docker não estiver iniciado:**
    - **Windows:** Inicie o Docker Desktop.
    - **Linux:** Execute `sudo systemctl start docker`.

- **Erro de permissão (Linux):**
    - Execute `sudo docker-compose up`.

## 🔨 **Comandos Úteis**

- **Iniciar a aplicação:**
  ```bash
  docker-compose up
  ```

- **Iniciar em segundo plano:**
  ```bash
  docker-compose up -d
  ```

- **Parar a aplicação:**
  ```bash
  docker-compose down
  ```

- **Ver logs:**
  ```bash
  docker-compose logs
  ```

- **Reconstruir containers (em caso de alterações):**
  ```bash
  docker-compose up --build
  ```

## 📁 **Estrutura do Projeto**

```
├── frontend/          # Interface do usuário em React
├── backend/           # API REST em Spring Boot
└── python-export/     # Serviço de exportação para CSV
```

## 📬 **Contato**

Em caso de dúvidas ou problemas, entre em contato através de:
[Seus dados de contato aqui]


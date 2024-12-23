# Controle de Ponto

## Pré-requisitos

- Docker e Docker Compose instalados em sua máquina. 

---

## Iniciando a Aplicação

1. Clone o repositório para sua máquina local:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd desafio-ilumeo
   ```

2. Crie os arquivos `.env` com base nos exemplos fornecidos:

   - **Backend**: arquivo `.env` em `./backend`:
     ```
     DB_HOST=localhost
     DB_PORT=5432
     DB_USER=user
     DB_PASSWORD=password
     DB_NAME=dbname
     ```

   - **Frontend**: arquivo `.env` em `./frontend`:
     ```
     NEXT_PUBLIC_API_HOST='localhost:3001'
     ```

3. Suba os serviços usando o comando:
   ```bash
   docker-compose up --build
   ```

4. Acesse os serviços:
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend**: [http://localhost:3001](http://localhost:3001)
   - **Documentação da API**: [http://localhost:3001/api/docs](http://localhost:3001/api/docs)


## Rodando os Testes

Para rodar os testes no backend, utilize o comando:
   ```bash
   cd ./backend
   npm run test
   ```


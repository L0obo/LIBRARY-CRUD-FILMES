
# LIBRARY-CRUD-FILMES 🎬

Aplicativo completo para gerenciar uma lista de filmes, com funcionalidades de **criar**, **visualizar**, **editar**, **deletar** e **buscar por ID**.  
O backend é feito com **Node.js (Express)** e o frontend com **React Native** usando navegação de pilha.

---

## 📦 Tecnologias

### Backend
- Node.js
- Express
- JSON como banco de dados (`movies.json`)

### Frontend
- React Native
- Expo
- React Navigation

---

## ⚙️ Como rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/L0obo/library-crud-filmes.git
cd library-crud-filmes
```

### 2. Instale as dependências do backend

```bash
cd backend
npm install
```

### 3. Inicie o backend

```bash
node index.js
# ou, se preferir reinício automático:
npx nodemon index.js
```

> O servidor estará rodando em: `http://localhost:3000/movies`

### 4. Configure a URL da API no frontend

Abra `frontend/src/api/api.js` e atualize `API_URL` com o endereço do seu backend:

```js
const API_URL = 'http://localhost:3000/movies'; // ou seu IP na rede
```

> No celular físico, use o IP da sua máquina (ex: `http://192.168.X.X:3000/movies`)

### 5. Instale as dependências do frontend

```bash
cd ../frontend
npm install
```

### 6. Inicie o app React Native

```bash
npx expo start --tuneel
```

> O app abrirá no navegador. Use o QR Code com o Expo Go ou rode em um emulador.

---

## 📱 Funcionalidades

- **📋 Listar todos os filmes**
- **➕ Adicionar novo filme**
- **🔍 Buscar filme por ID**
- **✏️ Editar filme existente**
- **🗑️ Deletar filme com confirmação**
- **🔙 Botões de navegação intuitivos**

---

## 📁 Estrutura de Pastas

```
.
├── backend
│   ├── index.js
│   ├── routes
│   │   └── movies.js
│   └── movies.json
└── frontend
    ├── App.js
    ├── src
        ├── api
        │   └── api.js
        ├── components
        │   └── MovieItem.js
        └── screens
            ├── HomeScreen.js
            ├── CreateMovieScreen.js
            ├── EditMovieScreen.js
            ├── DeleteMovieScreen.js
            ├── ViewMovieScreen.js
            └── ListaFilmesScreen.js
```

---

## ✍️ Autor

Feito com 💛 por **Ícaro Iago**

---

## 📃 Licença

Este projeto está licenciado sob a licença MIT.

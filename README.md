
# 🎬 BlueFlix - Sua Galeria de Filmes

BlueFlix é um aplicativo completo para gestão de filmes, com funcionalidades de **exploração de catálogo via TMDB**, **galeria personalizada**, **edição local**, **listas de assistidos e recomendados**, além de uma interface moderna e responsiva com React Native.

---

## ✨ Funcionalidades Principais

### 🎥 Explorar Filmes
- Ver filmes populares da API TMDB.
- Buscar por título com debounce.
- Filtrar por gênero (Ação, Comédia, etc.).
- Scroll infinito com carregamento dinâmico.

### 📁 Gerenciar Galeria Pessoal
- Adicionar filmes à galeria personalizada.
- Evita duplicatas (não adiciona se já estiver salvo ou assistido).
- Editar informações (título, ano, imagem).
- Apagar filmes com confirmação.

### 🧠 Recomendações & Lista de Assistidos
- Recomendações aleatórias.
- Marcar como "Vale a pena ver de novo".
- Consultar lista de filmes assistidos.

### 📄 Detalhes do Filme
- Ver sinopse, nota, duração, gêneros.
- Botões inteligentes (Salvo/Assistido).

### 🎨 Experiência de Usuário
- Termos de uso ao iniciar o app pela primeira vez.
- Indicadores de carregamento e animações suaves.
- Design moderno com tons de azul e gradiente.

---

## 🛠️ Tecnologias Utilizadas

| Área       | Tecnologias/Ferramentas                        |
|------------|------------------------------------------------|
| **Frontend** | React Native, Expo, React Navigation, AsyncStorage, Linear Gradient |
| **Backend**  | Node.js, Express.js, CORS, JSON como base de dados |
| **APIs**     | The Movie Database (TMDB), API REST local     |

---

## 📁 Estrutura de Pastas

```
.
├── filmes-api
│   ├── movie-api
│   │   ├── routes
│   │   │   ├── movieRoutes.js
│   │   │   └── watchedRoutes.js
│   │   ├── movies.json
│   │   ├── watched.json
│   │   ├── server.js
│   │   └── package.json
├── movie-app
│   ├── src
│   │   ├── api
│   │   │   ├── api.js
│   │   │   └── tmdbApi.js
│   │   ├── components
│   │   │   ├── AppBackground.js
│   │   │   └── MovieItem.js
│   │   ├── screens
│   │   │   ├── HomeScreen.js
│   │   │   ├── ListFilmsScreen.js
│   │   │   ├── CreateMovieScreen.js
│   │   │   ├── EditMovieScreen.js
│   │   │   ├── DeleteMovieScreen.js
│   │   │   ├── ViewMovieScreen.js
│   │   │   ├── MovieDetailsScreen.js
│   │   │   ├── MarkAsWatchedScreen.js
│   │   │   ├── ValeAPenaVerDeNovoScreen.js
│   │   │   └── TermsScreen.js
│   │   ├── styles
│   │   │   └── colors.js
│   ├── App.js
```

---

## 🚀 Como Executar o Projeto

### ✅ Pré-requisitos

- Node.js instalado
- Expo CLI instalado globalmente (`npm install -g expo-cli`)
- Aplicativo **Expo Go** no celular

---

### 🔑 1. Obter API Key da TMDB
- Crie uma conta em: https://www.themoviedb.org/signup
- Vá até *Configurações > API* e copie sua **API Key v3**

---

### 📦 2. Clonar o Repositório

```bash
git clone https://github.com/L0obo/library-crud-filmes.git
cd library-crud-filmes
```

---

### 🔧 3. Configurar e Rodar o Backend

```bash
cd filmes-api/movie-api
npm install
npm start
```

> O servidor estará disponível em: `http://localhost:3000`

---

### 🎨 4. Configurar o Frontend

```bash
cd ../../movie-app
npm install
```

- No arquivo `src/api/tmdbApi.js`, substitua a variável `API_KEY` pela sua chave da TMDB.
- No arquivo `src/api/api.js`, atualize a URL da API local:
```js
const API_URL = 'http://<SEU-IP-LOCAL>:3000/movies';
```

> Use o IP local da sua máquina se for testar no celular físico (ex: `http://192.168.X.X:3000`)

---

### 📱 5. Iniciar o App Mobile

```bash
npx expo start --tunnel
```

- Use o **Expo Go** para escanear o QR Code no terminal.
- O app será carregado no seu celular.

---

## 🧑‍💻 Autor

Feito com 💛 por **Ícaro Iago**  
GitHub: [@L0obo](https://github.com/L0obo)

---

## 📃 Licença

Este projeto está licenciado sob a Licença MIT.

---

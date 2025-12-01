# ArriBot - AI Learning Platform

<div align="center">

![ArriBot](https://img.shields.io/badge/ArriBot-AI%20Learning%20Platform-purple?style=for-the-badge)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-green?style=for-the-badge&logo=springboot)
![React](https://img.shields.io/badge/React-18.2-blue?style=for-the-badge&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green?style=for-the-badge&logo=mongodb)

**A modern, full-stack AI-powered learning platform with chatbot, flashcard generation, quiz creation, and text summarization features.**

</div>

## ✨ Features

- 🤖 **AI ChatBot** - Real-time Q&A and coding assistance powered by Google Gemini
- 📚 **Flashcards Generator** - Automatically generate study flashcards on any topic
- 📝 **Quiz Generator** - Create interactive quizzes with multiple-choice questions
- 📄 **Text Summarizer** - Condense long paragraphs into concise summaries
- 🎨 **Modern UI** - Beautiful purple-themed interface with smooth animations
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 💾 **Data Persistence** - All generated content stored in MongoDB

## 🛠️ Technology Stack

### Backend
- **Spring Boot 3.2.0** - Java framework for REST APIs
- **Maven** - Dependency management
- **MongoDB** - NoSQL database
- **Google Gemini API** - AI content generation
- **OkHttp** - HTTP client for API calls

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **Axios** - HTTP client

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Web server for frontend

## 📋 Prerequisites

- **Java 17+** (for local backend development)
- **Node.js 18+** (for local frontend development)
- **Maven 3.9+** (for backend build)
- **MongoDB 7.0+** (or use Docker)
- **Docker & Docker Compose** (for containerized deployment)
- **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))

## 🚀 Quick Start

### Option 1: Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ArriBot
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your Gemini API key
   ```

3. **Start all services**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:8080
   - MongoDB: localhost:27017

### Option 2: Local Development

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Configure application properties**
   ```bash
   # Edit src/main/resources/application.properties
   # Add your Gemini API key:
   gemini.api.key=your-api-key-here
   ```

3. **Start MongoDB** (if not using Docker)
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:7.0
   
   # Or install MongoDB locally
   ```

4. **Run the backend**
   ```bash
   mvn spring-boot:run
   ```

   Backend will start on http://localhost:8080

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   Frontend will start on http://localhost:5173

## 📡 API Endpoints

### Chat
- `POST /api/chat` - Send a message to the chatbot
- `GET /api/chat/history/{sessionId}` - Get chat history

### Flashcards
- `POST /api/flashcards/generate` - Generate flashcards
- `GET /api/flashcards/topic/{topic}` - Get flashcards by topic
- `GET /api/flashcards` - Get all flashcards

### Quiz
- `POST /api/quiz/generate` - Generate a quiz
- `GET /api/quiz/topic/{topic}` - Get quizzes by topic
- `GET /api/quiz/{id}` - Get quiz by ID
- `GET /api/quiz` - Get all quizzes

### Summarization
- `POST /api/summarize` - Summarize text
- `GET /api/summarize` - Get all summaries

## 🎨 UI Features

- **Purple Theme** - Consistent purple color scheme throughout
- **Glass Morphism** - Modern frosted glass effects
- **Smooth Animations** - Framer Motion powered transitions
- **Responsive Design** - Mobile-first approach
- **Interactive Elements** - Hover effects and micro-interactions
- **Loading States** - Visual feedback for all async operations

## 🔧 Configuration

### Backend Configuration

Edit `backend/src/main/resources/application.properties`:

```properties
# Server
server.port=8080

# MongoDB
spring.data.mongodb.host=localhost
spring.data.mongodb.port=27017
spring.data.mongodb.database=arribot

# Gemini API
gemini.api.key=your-api-key-here
```

### Frontend Configuration

Edit `frontend/vite.config.js` for proxy settings:

```javascript
server: {
  proxy: {
    '/api': 'http://localhost:8080'
  }
}
```

## 🐳 Docker Commands

```bash
# Build and start all services
docker-compose up --build

# Start in detached mode
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild specific service
docker-compose up --build backend
```

## 📦 Project Structure

```
ArriBot/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/arribot/
│   │   │   │   ├── config/          # Configuration classes
│   │   │   │   ├── controller/      # REST controllers
│   │   │   │   ├── model/           # MongoDB models
│   │   │   │   ├── repository/      # Data repositories
│   │   │   │   ├── service/         # Business logic
│   │   │   │   └── ArribotApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   ├── pom.xml
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/              # React components
│   │   ├── pages/                   # Page components
│   │   ├── utils/                   # Utilities
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
├── .env.example
└── README.md
```

## 🔍 Troubleshooting

### Backend Issues

**MongoDB Connection Failed**
- Ensure MongoDB is running
- Check connection string in `application.properties`
- Verify network connectivity in Docker

**Gemini API Errors**
- Verify API key is correct
- Check API quota and limits
- Ensure internet connectivity

### Frontend Issues

**API Calls Failing**
- Ensure backend is running on port 8080
- Check CORS configuration
- Verify proxy settings in `vite.config.js`

**Build Errors**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Google Gemini API for AI capabilities
- Spring Boot team for the excellent framework
- React and Vite teams for modern frontend tools
- Tailwind CSS for the utility-first CSS framework

---

<div align="center">

**Built with ❤️ using Spring Boot, React, and Google Gemini**

</div>

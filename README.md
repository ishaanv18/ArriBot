# ArriBot - Holographic Spatial Workspace 🚀

![ArriBot Hero](/frontend/public/assets/arribot-logo-new.png)

**ArriBot** is a next-generation AI Learning Companion featuring a **Holographic Spatial Interface**. It combines advanced AI agents with a "void-style" aesthetic to create an immersive productivity environment.

## ✨ Features

### 🎨 Holographic UI (Frontend)
-   **Spatial Design**: Glassmorphism, tilt effects, and parallax scrolling.
-   **Floating Dock**: macOS-style navigation with magnification.
-   **Liquid Inputs**: Interactive form fields with fluid animations.
-   **Spotlight Cursor**: Dynamic lighting effects tracking user interaction.
-   **Void Theme**: Deep purple/black aesthetic (`#030014`) with cyan neon accents.

### 🧠 Modules (AI Powered)
-   **Neural Chat**: Real-time conversation with context awareness (Gemini 2.0 Flash).
-   **Memory Shards (Flashcards)**: AI-generated study aids.
-   **Cognitive Assessment (Quizzes)**: On-demand evaluations.
-   **Data Compression (Summarizer)**: Insight extraction from long texts.

### 🛡️ Security
-   **Biometric-Style Auth**: "Scan" animations for login.
-   **OTP Verification**: 4-digit secure code with expiration handling.
-   **JWT Sessions**: Stateless, secure authentication.

## 🛠️ Tech Stack

-   **Frontend**: React (Vite), TailwindCSS, Framer Motion, Lucide Icons.
-   **Backend**: Java Spring Boot 3.2, Spring Security.
-   **Database**: MongoDB Atlas.
-   **AI Engine**: Google Gemini 2.0 Flash API.
-   **Services**: SendGrid (Email).

## 🚀 Getting Started

### Prerequisites
-   Node.js v18+
-   Java JDK 17+
-   MongoDB Instance
-   SendGrid API Key
-   Gemini API Key

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/ishaanv18/ArriBot.git
    cd ArriBot
    ```

2.  **Setup Backend**
    ```bash
    cd backend
    # Update src/main/resources/application.properties with your keys
    ./mvnw spring-boot:run
    ```
    *Server runs on Port 10000*

3.  **Setup Frontend**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    *Client runs on Port 5173*

## 🤝 Contributing

Protocol:
1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

Distributed under the MIT License.

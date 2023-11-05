# TapeTally

TapeTally is a Next.js application that integrates with the Spotify API to retrieve a user's top artists and tracks, presenting them in a unique, retro mixtape style.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:

-   [Node.js](https://nodejs.org/)
-   [npm](https://www.npmjs.com/) (Typically comes with Node.js)

### Installation

1. **Clone the Repository**

    ```bash
    git clone https://github.com/jonada182/tapetally.git
    cd tapetally
    ```

2. **Install Dependencies**

    ```bash
    npm install
    ```

3. **Environment Setup**

    Create a `.env.local` file in the root directory and add the following environment variables:

    ```
    SPOTIFY_CLIENT_ID=your_spotify_client_id
    SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
    SPOTIFY_REDIRECT_URI=http://localhost:3000
    MOCK_API=true
    ```

    Replace `your_spotify_client_id` and `your_spotify_client_secret` with your Spotify application credentials.

### Running the Application

-   **Development Mode**

    ```bash
    npm run dev
    ```

    This will start the development server on [http://localhost:3000](http://localhost:3000). Navigate to this URL in a web browser to view the application.

-   **Production Build**

    ```bash
    npm run build
    npm run start
    ```

    This will create a production build and then start the application in production mode.

-   **Linting**

    ```bash
    npm run lint
    ```

    Use this to run ESLint to find and fix problems in your JavaScript code.

-   **Using Docker**

    ```bash
    docker compose up --build -d
    ```

## License

This project is licensed under the [MIT License](LICENSE.md).

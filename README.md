# AutoArch

**AI-Powered Architecture Diagramming & Code Generation**

AutoArch is a modern, web-based tool that allows developers to design software architectures visually and generate production-ready backend code instantly.

![AutoArch Screenshot](https://via.placeholder.com/800x400?text=AutoArch+Screenshot)

## Features

-   **Visual Editor**: Drag-and-drop interface for designing microservices, databases, and infrastructure.
-   **Smart Connections**: Connect nodes to define relationships (e.g., Service -> Database).
-   **Advanced Properties**: Configure TLS, ports, and environment variables directly in the UI.
-   **Code Generation**:
    -   **Microservices**: Generates full **FastAPI** (Python) project structures.
    -   **Databases**: Automatically configures `docker-compose.yml` with Postgres/Redis.
    -   **API Gateway**: Generates dynamic **Nginx** configurations for routing.
-   **Project Management**: Name your projects and manage multiple architectures.

## Tech Stack

-   **Frontend**: React.js, Tailwind CSS, React Flow
-   **Backend**: Python, FastAPI
-   **Infrastructure**: Docker, Nginx

## Getting Started

### Prerequisites

-   **Node.js (v16+)**: Required to build and run the React frontend.
-   Python (v3.9+)
-   Docker & Docker Compose

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/auto_arch.git
    cd auto_arch
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    pip install -r requirements.txt
    uvicorn app.main:app --reload
    ```

3.  **Frontend Setup**
    ```bash
    cd frontend/auto_arch
    npm install
    npm start
    ```

4.  **Access the App**
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1.  **Design**: Drag nodes from the sidebar onto the canvas.
2.  **Connect**: Link services to databases or other services.
3.  **Configure**: Click a node or connection to edit properties (TLS, names, etc.).
4.  **Generate**: Enter a project name in the header and click **"Generate Code"**.
5.  **Deploy**: Navigate to `backend/<your-project-name>` and run:
    ```bash
    docker-compose up --build
    ```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

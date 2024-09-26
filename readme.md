# Prompt Manager Web Application Style Guide

## Table of Contents
1. Introduction
2. Project Overview
3. Development Guidelines
4. Directory Structure
5. Dependencies
6. Backend Development
7. Frontend Development
8. Database Design
9. API Endpoints
10. Dockerization and Deployment
11. Additional Notes
12. References

### Section 1: Introduction
This style guide provides comprehensive guidelines for developing the Prompt Manager Web Application. The application is designed to manage prompt templates programmatically used in LLM-based applications. This guide covers the project structure, development rules, dependencies, and other essential details to ensure a consistent and maintainable codebase.

### Section 2: Project Overview
- Objective: Create a lightweight web application deployed in Docker, featuring a PostgreSQL database and a FastAPI server.
- Core Functionality:
  - Manage prompt templates with placeholder variables.
  - Create, edit, copy, and duplicate prompts within projects.
  - Track prompt usage and collect feedback.
- User Interface:
  - Modern, minimalistic design similar to Notion's dark mode.
  - Built using ShadCN UI components.
  - Responsive and intuitive layout.

### Section 3: Development Guidelines
1. Coding Standards
    - Use snake_case for variable names.
    - Follow PEP 8 guidelines for Python code.
    - Use consistent indentation (4 spaces).
    - Write clear, descriptive variable and function names.
    - Include type hints for all functions and variables.
    - Use meaningful comments to explain complex logic.
2. Documentation
    - Use Markdown for all documentation.
    - Document all functions and classes using docstrings.
    - Maintain an up-to-date README file.
3. Version Control
    - Use Git for version control.
    - Commit frequently with clear, concise commit messages.
    - Use feature branches for new development.
    - Perform code reviews before merging into the main branch.
4. Testing
    - Write unit tests for critical functionalities.
    - Use pytest for Python tests.
5. Security
    - Implement input validation and sanitization.
    - Use HTTPS for all network communications.
    - Store sensitive information securely (e.g., passwords, API keys).
6. Performance
    - Optimize database queries and API endpoints for performance.
    - Use asynchronous programming for I/O-bound tasks.
7. Code Review
    - Review code for style, performance, and security issues.
    - Ensure all code changes are thoroughly tested.
    - Use Codeium PR-Agent and Rabbit for code reviews.
    - Document evolving knowledge in the .cursorrules file.

### Section 4: Directory Structure
The project is divided into two main components: backend and frontend.
```
prompt_manager/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── crud.py
│   │   ├── database.py
│   │   ├── dependencies.py
│   │   └── templates/
│   ├── alembic/
│   │   ├── versions/
│   │   ├── env.py
│   │   └── script.py.mako
│   ├── alembic.ini
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── prompt_manager/
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── styles/
│   │   │   ├── app/
│   │   │   └── lib/
│   │   ├── package.json
│   │   ├── package-lock.json
│   │   └── next.config.js
│   └── Dockerfile
├── docker-compose.yml
├── README.md
├── .env.local
├── .cursorrules
├── .dockerignore
└── .gitignore
```
- .env.local: Local environment variables. 
    # .env.local
    DATABASE_USER=your_db_username
    DATABASE_PASSWORD=your_db_password
    DATABASE_HOST=localhost
    DATABASE_PORT=5432
    DATABASE_NAME=prompt_db

- backend/
  - Contains the FastAPI application.
  - app/
    - Main application code.
    - main.py: Initializes the FastAPI app and defines the API endpoints.
    - models.py: SQLAlchemy models.
    - schemas.py: Defines Pydantic models for request and response validation.
    - crud.py: Contains functions for Create, Read, Update, Delete operations.
    - database.py: Sets up the database engine and session local.
    - dependencies.py: Manages dependency injections for database sessions.
    - config.py: Configuration settings.
  - templates/: Jinja2 templates (if needed).
  - alembic/: Database migrations.
  - requirements.txt: Python dependencies.
  - Dockerfile: Docker configuration for the backend.

#### Settings Class

# backend/app/config.py
```python
from pydantic import BaseSettings, Field
from functools import lru_cache

class LoggingSettings(BaseSettings):
    level: str = Field('INFO', env='LOG_LEVEL')
    format: str = Field('%(asctime)s - %(name)s - %(levelname)s - %(message)s', env='LOG_FORMAT')

class Settings(BaseSettings):
    database_user: str = Field(..., env='DATABASE_USER')
    database_password: str = Field(..., env='DATABASE_PASSWORD')
    database_host: str = Field('localhost', env='DATABASE_HOST')
    database_port: int = Field(5432, env='DATABASE_PORT')
    database_name: str = Field(..., env='DATABASE_NAME')
    secret_key: str = Field('your-secret-key', env='SECRET_KEY')  # For future use

    logging: LoggingSettings = LoggingSettings()  # Grouped logging settings

    class Config:
        env_file = '.env.local'
        env_file_encoding = 'utf-8'

    def get_db_uri(self) -> str:
        """Construct the database URI from the individual components."""
        return f"postgresql://{self.database_user}:{self.database_password}@{self.database_host}:{self.database_port}/{self.database_name}"

    def get_db_credentials(self) -> dict:
        """Return database credentials as a dictionary."""
        return {
            'user': self.database_user,
            'password': self.database_password,
            'host': self.database_host,
            'port': self.database_port,
            'dbname': self.database_name
        }

@lru_cache()
def get_settings() -> Settings:
    return Settings()

```

- frontend/
  - Contains the React application.
  - prompt_manager/
    - src/: Source code for the frontend.
      - components/: Reusable React components.
      - pages/: Page components for routing.
      - styles/: CSS and styling files.
    - package.json: Node.js dependencies.
    - Dockerfile: Docker configuration for the frontend.

- docker-compose.yml: Docker Compose configuration to run multi-container applications.
- README.md: Project documentation.
- .gitignore: Specifies intentionally untracked files to ignore.


### Section 5: Dependencies
#### Backend Dependencies
| Package            | Description                                 | Documentation      |
|--------------------|---------------------------------------------|--------------------|
| FastAPI            | Web framework for building APIs             | [FastAPI Docs](https://fastapi.tiangolo.com) |
| Uvicorn            | ASGI server implementation                  | [Uvicorn Docs](https://www.uvicorn.org) |
| SQLAlchemy         | Database ORM                                | [SQLAlchemy Docs](https://docs.sqlalchemy.org) |
| Alembic            | Database migrations                         | [Alembic Docs](https://alembic.sqlalchemy.org) |
| Pydantic           | Data validation and settings management      | [Pydantic Docs](https://pydantic-docs.helpmanual.io) |
| Jinja2             | Templating engine                           | [Jinja2 Docs](https://jinja.palletsprojects.com) |
| Psycopg2-binary    | PostgreSQL database adapter for Python       | [Psycopg2 Docs](https://www.psycopg.org) |
| Python-Multipart   | Handling multipart/form-data for file uploads| [Docs](https://andrew-d.github.io/python-multipart/) |
| python-dotenv      | Loading environment variables from .env file   | [Docs](https://pypi.org/project/python-dotenv/) |

Install these dependencies using pip:
```bash
pip install fastapi uvicorn sqlalchemy alembic pydantic jinja2 psycopg2 python-multipart
```

| Package             | Description                                      | Documentation        |
|---------------------|--------------------------------------------------|----------------------|
| React               | JavaScript library for building user interfaces   | [React Docs](https://reactjs.org) |
| ShadCN UI           | UI components for React                          | [ShadCN UI Docs](https://shadcn.dev) |
| Axios               | Promise-based HTTP client for the browser        | [Axios Docs](https://axios-http.com) |
| React Router DOM     | Routing library for React applications           | [React Router Docs](https://reactrouter.com) |

Install these dependencies using npm:
```bash
npm install react react-dom shadcn-ui axios react-router-dom
```

### Section 6: Backend Development
#### Coding Standards
- **Language**: Python 3.11
- **Framework**: FastAPI
- **Database ORM**: SQLAlchemy with Alembic for migrations
- **Data Validation**: Pydantic models
- **Template Engine**: Jinja2 for prompt rendering

#### Key Files and Their Purpose
- **main.py**: Initializes the FastAPI app and defines the API endpoints.
- **models.py**: Defines the database models using SQLAlchemy.
- **schemas.py**: Defines Pydantic models for request and response validation.
- **crud.py**: Contains functions for Create, Read, Update, Delete operations.
- **database.py**: Sets up the database engine and session local.
- **dependencies.py**: Manages dependency injections for database sessions.
- **alembic/**: Handles database migrations.

#### Database Models

##### Project
- **id**: Integer, Primary Key
- **name**: String, Unique, Not Null
- **Relationships**:
  - **prompts**: One-to-Many with Prompt

##### Prompt
- **id**: Integer, Primary Key
- **project_id**: Foreign Key to Project
- **name**: String, Not Null
- **content**: String, Not Null
- **created_at**: DateTime, Default Now
- **Relationships**:
  - **project**: Many-to-One with Project
  - **feedbacks**: One-to-Many with PromptFeedback

##### PromptFeedback
- **id**: Integer, Primary Key
- **prompt_id**: Foreign Key to Prompt
- **is_positive**: Boolean, Not Null
- **created_at**: DateTime, Default Now
- **Relationships**:
  - **prompt**: Many-to-One with Prompt

#### Backend Development Steps
1. Set up the environment
- conda create -n prompt-manager python=3.11
- conda activate prompt-manager

2. Install dependencies
    ```bash
    pip install -r requirements.txt
    ```

    ```bash
    pip install fastapi uvicorn sqlalchemy alembic pydantic jinja2 psycopg2 python-multipart
    ```
3. Initialize Alembic for Migrations
    ```bash
    alembic init alembic
    ```
4. Configure Database URL
    ```bash
    export DATABASE_URL="postgresql://username:password@localhost:5432/dbname"
    ```
5. Create and Apply Migrations
    ```bash
    alembic revision --autogenerate -m "Initial migration"
    alembic upgrade head
    ```

### Section 7: Frontend Development
#### Key Files and Their Purpose
- **src/app/page.tsx**: Dashboard page component, displays projects and prompt card grids.
- **src/app/prompt-editor/page.tsx**: Prompt Editor page component, allows editing of a single prompt's data.
- **src/components/**: Contains reusable UI components like ProjectCard, PromptCard.
- **src/lib/**: Contains utility functions and shared logic.
- **src/styles/**: Contains global and component-specific styling.

#### Frontend Page Structure
1. Dashboard Page
   - File: `frontend/prompt_manager/src/app/page.tsx`
   - URL: `/`
   - Purpose: Displays all projects and their associated prompt card grids.

2. Prompt Editor Page
   - File: `frontend/prompt_manager/src/app/prompt-editor/page.tsx`
   - URL: `/prompt-editor`
   - Purpose: Allows editing and saving of a single prompt's data.

#### Frontend Development Steps
1. Set up the Next.js application structure (already done)
2. Implement the Dashboard page (`src/app/page.tsx`)
3. Implement the Prompt Editor page (`src/app/prompt-editor/page.tsx`)
4. Create necessary components in the `src/components/` directory
5. Implement API integration using Axios
6. Apply styling using Tailwind CSS and ShadCN UI components

### Section 8: Database Design
The database consists of three main tables:

### projects

**Columns**:
- `id`: Primary Key
- `name`: Unique, Not Null

### prompts

**Columns**:
- `id`: Primary Key
- `project_id`: Foreign Key to `projects.id`
- `name`: Not Null
- `content`: Not Null
- `created_at`: Timestamp

### prompt_feedbacks

**Columns**:
- `id`: Primary Key
- `prompt_id`: Foreign Key to `prompts.id`
- `is_positive`: Boolean
- `created_at`: Timestamp

### Relationships:
- One **Project** has many **Prompts**.
- One **Prompt** has many **PromptFeedbacks**.

### Database User Permissions
When setting up a new PostgreSQL database and tables for this project, it's crucial to grant the necessary permissions to the database user. Execute the following commands as a superuser (usually postgres) to ensure proper access:

```sql
-- Replace 'your_user' with the actual username your application is using to connect to the database
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO your_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO your_user;
```

These commands grant the required permissions for the application to interact with all tables and sequences in the public schema. Make sure to run these commands after creating the database and before running the application.

## API Endpoints

### Project Endpoints
- **POST** `/projects/`  
  Create a new project.
  
- **GET** `/projects/`  
  Retrieve all projects.
  
- **GET** `/projects/{project_id}`  
  Retrieve a specific project.
  
- **PUT** `/projects/{project_id}`  
  Update a project.
  
- **DELETE** `/projects/{project_id}`  
  Delete a project.

### Prompt Endpoints
- **POST** `/projects/{project_id}/prompts/`  
  Create a new prompt within a project.
  
- **GET** `/projects/{project_id}/prompts/`  
  Retrieve all prompts in a project.
  
- **GET** `/prompts/{prompt_id}`  
  Retrieve a specific prompt.
  
- **PUT** `/prompts/{prompt_id}`  
  Update a prompt.
  
- **DELETE** `/prompts/{prompt_id}`  
  Delete a prompt.

### Feedback Endpoint
- **POST** `/prompts/{prompt_id}/feedback/`  
  Submit feedback (thumbs-up/thumbs-down) for a prompt.

### Rendering Endpoint
- **POST** `/prompts/{prompt_id}/render/`  
  Render a prompt with provided placeholder variables.

## Dockerization and Deployment

### Docker Setup
- Dockerfiles are provided for both the backend and frontend services.
- Docker Compose is used to orchestrate multi-container deployment, including the PostgreSQL database.
- DEVELOPMENT: configure `docker-compose.yml` to allow network communication with the host machine.
  ```yaml
  - DATABASE_URL=postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@host.docker.internal:${DATABASE_PORT}/${DATABASE_NAME}
  ```
  Configure `.env.docker` to reference the local database ``` DATABASE_HOST=host.docker.internal```
- PRODUCTION: configure docker-compose to allow network communication within application containers.
  ```yaml
  - DATABASE_URL=postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@db:${DATABASE_PORT}/${DATABASE_NAME}
  ```
  Configure `.env.docker` to reference the containerized database ``` DATABASE_HOST=db```

### Docker Compose File
- Located at the project root, `docker-compose.yml` defines services:
  - **db**: PostgreSQL database.
  - **backend**: FastAPI application.
  - **frontend**: React application.

#### backend/dockerfile:
    ```dockerfile
    FROM python:3.11-slim
    WORKDIR /app
    COPY requirements.txt .
    RUN pip install --no-cache-dir -r requirements.txt
    COPY . .
    EXPOSE 8000
    CMD ["sh", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
    ```

#### frontend/dockerfile:
    ```dockerfile
    FROM node:18-alpine
    WORKDIR /app
    COPY prompt_manager/package.json prompt_manager/package-lock.json ./
    RUN npm install
    COPY prompt_manager .
    EXPOSE 3000
    CMD ["npm", "run", "dev"]
    ```
### Environment Variables
- Use environment variables for sensitive information and configuration.
- Define variables in the `docker-compose.yml` file under the `environment` section.

### Building and Running Containers
- Build and start all services:
    ```bash
    docker-compose up --build
    ```
- Access the application at `http://localhost:3000`.

### Additional Notes
- Ensure Docker and Docker Compose are installed.
- Adjust the `DATABASE_URL` in the `docker-compose.yml` file to match your database configuration.
- Use `docker-compose down` to stop and remove containers.

#### Logging and Monitoring
- Implement logging using Python's built-in logging module.
- Monitor application performance and errors.

### References
- FastAPI Documentation: https://fastapi.tiangolo.com/
- SQLAlchemy Documentation: https://docs.sqlalchemy.org/en/20/
- Alembic Documentation: https://alembic.sqlalchemy.org/en/latest/
- Pydantic Documentation: https://docs.pydantic.dev/latest/api/base_model/
- Jinja2 Documentation: https://jinja.palletsprojects.com/
- React Documentation: https://reactjs.org/docs/getting-started.html
- ShadCN UI Documentation: https://ui.shadcn.com/docs
- Docker Documentation: https://docs.docker.com/
- Docker Compose Documentation: https://docs.docker.com/compose/
- PostgreSQL Documentation: https://www.postgresql.org/docs/current/
- v0 Documentation: https://v0.dev/

### Section 12: Import Handling and Running FastAPI

#### Import Handling
In our FastAPI application, we use relative imports to maintain a clean and organized structure. Here's how we handle imports:

1. For importing from within the `app` directory, use relative imports:
   ```python
   from .database import SessionLocal
   from .models import Project
   ```

2. For importing from sibling directories, use absolute imports starting from `app`:
   ```python
   from app.routers import projects, prompts
   from app.config import get_settings
   ```

3. For standard library or third-party imports, use regular imports:
   ```python
   from fastapi import FastAPI
   import uvicorn
   ```

#### Running FastAPI
To run the FastAPI application:

1. Navigate to the 'backend' directory:
   ```bash
   cd backend
   ```

2. Execute the following command in the terminal:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 7070 --reload
   ```

   This command does the following:
   - `uvicorn`: The ASGI server we're using to run our FastAPI application
   - `app.main:app`: Points to the `app` object in `main.py`
   - `--host 0.0.0.0`: Makes the server accessible from any IP address
   - `--port 7070`: Runs the server on port 7070
   - `--reload`: Enables auto-reloading when code changes are detected (useful for development)

The application will start and be accessible at `http://localhost:7070`.

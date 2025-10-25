# Document Processing Application

This API processes shipment documents and data is made readily available to user on UI

## Setup

1. Clone the repository
2. Install dependencies: `pip install -r requirements.txt`
3. Run the API: `python -m app.main`
4. You may access the API docs at [`http://localhost:8000/docs`](http://localhost:8000/docs)

## API Endpoints

- `POST /process-documents`: Single endpoint to process all documents and fill out the form
## Docker (Full Stack)

### Using Docker Compose (Recommended)

Run both **frontend** and **backend** together:

1. Create a `.env` file with your API key:
```bash
echo "GEMINI_API_KEY=your_api_key_here" > .env
```

2. Start the full application:
```bash
docker-compose up -d
```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

4. View logs:
```bash
docker-compose logs -f
```

5. Stop the application:
```bash
docker-compose down
```

### Using Docker CLI (Backend only)

Build the Docker image: 
```bash
docker build -t document-processor .
```

Run the Docker container:
```bash
docker run -d -p 8000:8000 -e GEMINI_API_KEY=your_api_key document-processor
```

### Docker Features
- ✅ **Multi-container setup** - Frontend (Next.js) + Backend (FastAPI)
- ✅ **Multi-worker support** - 4 uvicorn workers for backend
- ✅ **Health checks** - Automatic monitoring for both services
- ✅ **Non-root user** - Enhanced security
- ✅ **Optimized builds** - Multi-stage builds for smaller images
- ✅ **Auto-restart** - Containers restart automatically on failure
- ✅ **Network isolation** - Services communicate via Docker network

## Testing


Run tests:

```bash
    pytest
```

## Evaluation

Run the evaluation script:

```bash
    python evaluation.py
```

## How to run - AI Customs Tool

### Backend:
```bash
    python -m app.main
```

### Frontend:
```bash
    cd web && npm install && npm run dev
```
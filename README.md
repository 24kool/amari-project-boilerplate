# Document Processing Application

This API processes shipment documents and data is made readily available to user on UI

## Setup

1. Clone the repository
2. Install dependencies: `pip install -r requirements.txt`
3. Run the API: `python -m app.main`
4. You may access the API docs at [`http://localhost:8000/docs`](http://localhost:8000/docs)

## API Endpoints

- `POST /process-documents`: Single endpoint to process all documents and fill out the form
## Docker

Build the Docker image: 

```bash
    docker build -t document-processor .
```

Run the Docker container:

```bash
    docker run -d -p 8000:8000 document-processor
```

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
# Document Processing API

This API processes shipment documents and fills out a form with the extracted information.

## Setup

1. Clone the repository
2. Install dependencies: `pip install -r requirements.txt`
3. Run the API: `python -m app.main`
4. You may access the API at [`http://localhost:8000/docs`](http://localhost:8000/docs)

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
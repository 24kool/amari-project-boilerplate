from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
import os
import tempfile

from app.services.document_processor import process_documents
from app.services.llm_service import extract_entity_from_document, extract_average_gross_weight_from_document, extract_average_price_from_document

router = APIRouter()

@router.post("/process-documents", response_model=dict)
async def process_documents_endpoint(
    files: List[UploadFile] = File(...)
):
    temp_file_paths = []
    for file in files:
        # Save uploaded file temporarily
        temp_file = tempfile.NamedTemporaryFile(suffix=file.filename, delete=False)
        temp_file_paths.append(temp_file.name)

        # Write content to temp file
        content = await file.read()
        temp_file.write(content)
        temp_file.close()

    # Process documents
    document_data = process_documents(temp_file_paths)

    # Extract data from document
    extracted_data = extract_entity_from_document(document_data)

    # Extract average numbers from document
    avg_numbers_list, avg_numbers = extract_average_gross_weight_from_document(document_data)

    price_list, average_price = extract_average_price_from_document(document_data)

    # Clean up temp files
    for path in temp_file_paths:
        os.unlink(path)

    return {"extracted_data": extracted_data} 

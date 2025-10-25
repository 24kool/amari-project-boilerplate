from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
import os
import tempfile

from app.services.document_processor import process_documents
from app.services.llm_service import extract_entity_from_document, extract_average_gross_weight_from_document, extract_average_price_from_document, extract_line_item_count_from_document

router = APIRouter()

@router.post("/process-documents", response_model=dict)
async def process_documents_endpoint(
    files: List[UploadFile] = File(...)
):
    temp_file_paths = []
    for file in files:
        # Save uploaded file temporarily with correct extension
        file_extension = os.path.splitext(file.filename)[1] if file.filename else ''
        temp_file = tempfile.NamedTemporaryFile(suffix=file_extension, delete=False)
        temp_file_paths.append(temp_file.name)

        # Write content to temp file
        content = await file.read()
        temp_file.write(content)
        temp_file.close()

    # Process documents
    document_data = process_documents(temp_file_paths)

    # Extract data from document
    general_entity = extract_entity_from_document(document_data)

    # Extract average numbers from document
    avg_numbers_list, avg_numbers = extract_average_gross_weight_from_document(document_data)

    price_list, average_price = extract_average_price_from_document(document_data)
    
    line_item_count = extract_line_item_count_from_document(document_data)

    # Clean up temp files
    for path in temp_file_paths:
        os.unlink(path)

    return {
        "general_entity": general_entity,
        "gross_weight_list": avg_numbers_list,
        "average_gross_weight": avg_numbers,
        "price_list": price_list,
        "average_price": average_price,
        "line_item_count": line_item_count
    } 

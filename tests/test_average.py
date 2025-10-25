import os
import sys
from pathlib import Path

# Add app module to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.services.document_processor import process_documents
from app.services.llm_service import extract_average_numbers_from_document

if __name__ == "__main__":
    # Define file paths for both PDF and Excel files
    data_dir = Path(__file__).parent.parent / "data"
    file_paths = [
        str(data_dir / "sample_bill_of_lading.pdf"),
        str(data_dir / "sample_invoice.xlsx")
    ]
    
    # Process both documents
    result = process_documents(file_paths)
    print("Processing Complete!")
    print(f"Extracted PDF content: {len(result.get('pdf_text', ''))} characters")
    print(f"Extracted Excel content: {len(result.get('excel_text', ''))} characters")

    # Extract average numbers from document
    avg_numbers_list, avg_numbers = extract_average_numbers_from_document(result)
    print(f"Average numbers list: {avg_numbers_list}")
    print(f"Average numbers: {avg_numbers}")
    success = bool(result)
    exit(0 if success else 1)

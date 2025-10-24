import os
from typing import Optional, List
from unstructured.partition.auto import partition

# Use PaddleOCR
os.environ["OCR_AGENT"] = "unstructured.partition.utils.ocr_models.paddle_ocr.OCRAgentPaddle"
os.environ["CUDA_VISIBLE_DEVICES"] = ""

def extract_text_from_pdf(file_path: str) -> str:
    
    elements = partition(filename=file_path, strategy="ocr_only", languages=["en"])
    text = "\n".join(str(el) for el in elements).strip()
    return text

def extract_text_from_excel(file_path: str) -> str:
    """
    Extract text from an Excel file using Unstructured.
    
    Args:
        file_path: Path to the Excel file
        
    Returns:
        str: Extracted text from the Excel file
    """
    elements = partition(filename=file_path)
    text = "\n".join([str(el) for el in elements])
    return text


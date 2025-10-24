import os
from typing import Optional, List
from unstructured.partition.auto import partition

# Use PaddleOCR
os.environ.setdefault("OCR_AGENT", "paddleocr")

def extract_text_from_pdf(file_path: str) -> str:
    """
    Extract text from a PDF file using Unstructured with PaddleOCR.
    Tries OCR first; falls back to hi_res layout OCR.
    """
    try:
        # Try basic OCR
        elements = partition(filename=file_path, strategy="ocr_only", languages=["en"])
        text = [element.to_dict() for element in elements]
        if text:
            return text
    except Exception as e:
        print(f"OCR strategy failed: {e}")

    try:
        # Fallback to hi_res (layout-aware OCR)
        elements = partition(filename=file_path, strategy="hi_res", languages=["en"])
        return "\n".join(str(el) for el in elements).strip()
    except Exception as e:
        print(f"Warning: hi_res OCR failed: {e}")
        return ""

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


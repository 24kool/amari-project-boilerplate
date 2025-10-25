import os
import sys
from pathlib import Path

# Add app module to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.utils.doc_utils import extract_text_from_pdf


def test_extract_text_from_pdf():
    """Test that text is extracted correctly from a PDF"""
    pdf_path = Path(__file__).parent.parent / "data" / "sample_bill_of_lading.pdf"
    
    print("\n" + "="*60)
    print("📄 PDF OCR Text Extraction Test")
    print("="*60)
    
    # Check that the PDF file exists
    if not pdf_path.exists():
        print(f"❌ PDF file not found: {pdf_path}")
        return False
    
    print(f"✓ PDF file found: {pdf_path}")
    print(f"✓ File size: {pdf_path.stat().st_size / 1024:.2f} KB")
    
    # Extract text
    print("\n⏳ Extracting text with OCR...")
    try:
        text = extract_text_from_pdf(str(pdf_path))
    except Exception as e:
        print(f"❌ Error during extraction: {e}")
        return False
    
    # Check that the text was extracted properly
    if not text:
        print("❌ No text extracted")
        return False
    
    if len(text) == 0:
        print("❌ Extracted text is empty")
        return False
    
    # Success!
    print("\n✅ PDF text extraction successful!")
    print(f"✓ Extracted text length: {len(text)} characters")
    print(f"✓ Word count: {len(text.split())}")
    
    print("\n" + "-"*60)
    print("📋 Extracted text (first 500 characters):")
    print("-"*60)
    print(text)
    print("\n" + "="*60 + "\n")
    
    return True


if __name__ == "__main__":
    success = test_extract_text_from_pdf()
    exit(0 if success else 1)

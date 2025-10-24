import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.utils.doc_utils import extract_text_from_pdf

def test_extract_text_from_pdf():
    """Test extract_text_from_pdf with sample PDF file"""
    
    # PDF 파일 경로
    pdf_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'sample_bill_of_lading.pdf')
    
    print(f"\n{'='*60}")
    print(f"Testing extract_text_from_pdf()")
    print(f"{'='*60}")
    print(f"PDF File Path: {pdf_path}")
    print(f"File Exists: {os.path.exists(pdf_path)}\n")
    
    try:
        # extract_text_from_pdf 실행
        result = extract_text_from_pdf(pdf_path)
        
        print(f"Extraction Result Type: {type(result)}")
        print(f"Result Length: {len(str(result))}")
        print(f"\n{'-'*60}")
        print("Extracted Content:")
        print(f"{'-'*60}")
        print(result)
        print(f"{'-'*60}\n")
        
    except Exception as e:
        print(f"❌ Error occurred: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_extract_text_from_pdf()

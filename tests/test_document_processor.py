import pytest
from app.services.document_processor import process_documents
from pathlib import Path

# TODO: Incomplete tests
def test_process_documents():
    # Test with sample files
    sample_files = [
        #TODO: update this once the PDF processing is fixed
        # str(Path("data/sample_bill_of_lading.pdf")),
        str(Path("data/sample_invoice.xlsx"))
    ]
    result = process_documents(sample_files)
    
    # Print extracted results
    print("\n" + "="*80)
    print("📄 EXTRACTED RESULTS")
    print("="*80)
    
    if 'pdf_text' in result:
        print("\n🔴 PDF TEXT (Bill of Lading):")
        print("-" * 80)
        print(result['pdf_text'][:500] + "..." if len(result['pdf_text']) > 500 else result['pdf_text'])
        print(f"\n📊 Total PDF text length: {len(result['pdf_text'])} characters")
    
    if 'excel_text' in result:
        print("\n🟢 EXCEL TEXT (Invoice):")
        print("-" * 80)
        print(result['excel_text'][:500] + "..." if len(result['excel_text']) > 500 else result['excel_text'])
        print(f"\n📊 Total Excel text length: {len(result['excel_text'])} characters")
    
    print("\n" + "="*80)
    
    # Basic assertions
    assert result is not None
    assert isinstance(result, dict)
    assert len(result) > 0

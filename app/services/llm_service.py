import google.generativeai as genai
from app.core.config import settings

genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash")


def extract_field_from_document(document_text):
    """
    Use LLM to extract specific field from document text.
    
    Args:
        document_text: Text from the document
        
    Returns:
        str: Extracted field value
    """

    prompt = f"Extract the data from the following documents:\n\n{document_text}"

    response = model.generate_content(prompt)
    return response.text.strip()

def extract_average_numbers_from_document(document_text):

    prompt = f"Extract All the numbers for Total Gross Weight (KG) into a list of numbers from the following documents. Do not include any other text or numbers. Here is the example output: [number1, number2, number3]\n\n{document_text['excel_text']}"

    response = model.generate_content(prompt)
    avg_numbers = response.text.strip()

    avg_numbers = avg_numbers.strip('[]')
    avg_numbers_list = [float(num.strip()) for num in avg_numbers.split(",")]
    avg_numbers = sum(avg_numbers_list) / len(avg_numbers_list)
    return avg_numbers_list, avg_numbers
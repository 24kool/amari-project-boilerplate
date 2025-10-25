import google.generativeai as genai
import json
import re
from app.core.config import settings

genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash")


def extract_entity_from_document(document_text):
    """
    Use LLM to extract specific field from document text.
    
    Args:
        document_text: Text from the document
        
    Returns:
        dict: Extracted field values as a dictionary
    """

    prompt = f"""
You are an information extraction agent.
Your goal is to carefully read the following document text and extract key shipping information.

From the text below, identify and extract the following fields:
1. Bill of Lading Number
2. Container Number
3. Consignee Name
4. Consignee Address
5. Date of Export

Return the result **ONLY as a valid JSON object** with the following structure. Do NOT wrap it in markdown code blocks or ```json``` tags:

{{
  "bill_of_lading_number": "",
  "container_number": "",
  "consignee_name": "",
  "consignee_address": "",
  "date_of_export": ""
}}

If a field cannot be found, return an empty string ("") for that field.
Do not add any explanation, text, commentary, markdown formatting, or code blocks — only output the valid JSON object.

Document text:
{document_text}
"""

    response = model.generate_content(prompt)
    response_text = response.text.strip()
    
    # Remove markdown code block formatting if present
    response_text = re.sub(r'^```(json)?\s*', '', response_text)
    response_text = re.sub(r'\s*```$', '', response_text)
    response_text = response_text.strip()
    
    # Parse and validate JSON
    try:
        return json.loads(response_text)
    except json.JSONDecodeError:
        # If parsing fails, return the raw text for debugging
        return {"error": "Failed to parse JSON", "raw_response": response_text}

def extract_average_gross_weight_from_document(document_text):

    prompt = f"Extract All the numbers for Total Gross Weight (KG) into a list of numbers from the following documents. Do not include any other text or numbers. Here is the example output: [number1, number2, number3]\n\n{document_text['excel_text']}"

    response = model.generate_content(prompt)
    gross_weight_list = response.text.strip()

    gross_weight_list = gross_weight_list.strip('[]')
    gross_weight_list = [float(num.strip()) for num in gross_weight_list.split(",")]
    gross_weight = sum(gross_weight_list) / len(gross_weight_list)
    return gross_weight_list, gross_weight

def extract_average_price_from_document(document_text):

    prompt = f"Extract All the numbers for Total Value (USD) into a list of numbers from the following documents. Do not include any other text or numbers. Here is the example output: [number1, number2, number3]\n\n{document_text['excel_text']}"

    response = model.generate_content(prompt)
    price_list = response.text.strip()

    price_list = price_list.strip('[]')
    price_list = [float(num.strip()) for num in price_list.split(",")]
    average_price = sum(price_list) / len(price_list)
    return price_list, average_price

def extract_line_item_count_from_document(document_text):

    prompt = f'Extract only the number of line items from the following documents. Output ONLY the number (no text, no explanation, no JSON). Here is the document content:\n\n{document_text["excel_text"]}'

    response = model.generate_content(prompt)
    line_item_count = response.text.strip()
    return line_item_count
import fitz  # PyMuPDF
import io

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """
    Extracts text from a PDF file provided as bytes.
    Uses PyMuPDF (fitz) for fast and accurate extraction.
    """
    try:
        pdf_stream = io.BytesIO(pdf_bytes)
        doc = fitz.open(stream=pdf_stream, filetype="pdf")
        text_content = []
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            text_content.append(page.get_text())
        
        doc.close()
        return "\n".join(text_content)
    except Exception as e:
        print(f"Error parsing PDF: {e}")
        return ""

import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load env variables
load_dotenv()

# Initialize Gemini API
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
else:
    print("Warning: GEMINI_API_KEY environment variable is not set.")

def classify_file(filename: str, content_type: str) -> str:
    """
    Classify a file based on its filename and mime type.
    Returns: 'Documents', 'Images', 'Audio', 'Video', or 'Other'
    """
    if not api_key:
        # Fallback if key is missing
        return "Documents" if "pdf" in filename.lower() else "Images"

    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        
        prompt = f"""
        You are a smart file classification AI.
        Classify the file with name "{filename}" and MIME type "{content_type}" into one of the following exact categories:
        - Documents
        - Images
        - Audio
        - Video
        - Other

        Respond with ONLY the category name. No other text, punctuation, or explanation.
        """
        
        response = model.generate_content(prompt)
        category = response.text.strip()
        
        valid_categories = ["Documents", "Images", "Audio", "Video", "Other"]
        if category in valid_categories:
            return category
        
        # Fallback if LLM output is weird
        for cat in valid_categories:
            if cat.lower() in category.lower():
                return cat
                
        return "Other"
    except Exception as e:
        print(f"Gemini API Error: {e}")
        # Local rule fallback
        return "Documents" if "pdf" in filename.lower() else "Images"

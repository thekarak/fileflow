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

# Robust local fallback based on extension + MIME type
EXTENSION_MAP = {
    # Documents
    ".pdf": "Documents", ".doc": "Documents", ".docx": "Documents",
    ".txt": "Documents", ".rtf": "Documents", ".odt": "Documents",
    ".xls": "Documents", ".xlsx": "Documents", ".csv": "Documents",
    ".ppt": "Documents", ".pptx": "Documents",
    ".md": "Documents", ".tex": "Documents",
    # Images
    ".jpg": "Images", ".jpeg": "Images", ".png": "Images",
    ".gif": "Images", ".bmp": "Images", ".svg": "Images",
    ".webp": "Images", ".tiff": "Images", ".ico": "Images",
    ".heic": "Images", ".raw": "Images",
    # Audio
    ".mp3": "Audio", ".wav": "Audio", ".flac": "Audio",
    ".aac": "Audio", ".ogg": "Audio", ".wma": "Audio", ".m4a": "Audio",
    # Video
    ".mp4": "Video", ".mov": "Video", ".avi": "Video",
    ".mkv": "Video", ".wmv": "Video", ".webm": "Video",
    ".flv": "Video", ".m4v": "Video",
    # Code
    ".py": "Code", ".js": "Code", ".ts": "Code", ".jsx": "Code",
    ".tsx": "Code", ".html": "Code", ".css": "Code", ".java": "Code",
    ".cpp": "Code", ".c": "Code", ".go": "Code", ".rs": "Code",
    ".rb": "Code", ".php": "Code", ".swift": "Code", ".kt": "Code",
    ".sh": "Code", ".json": "Code", ".xml": "Code", ".yaml": "Code",
    ".yml": "Code", ".sql": "Code",
    # Archives
    ".zip": "Archives", ".rar": "Archives", ".7z": "Archives",
    ".tar": "Archives", ".gz": "Archives", ".bz2": "Archives",
}

MIME_PREFIX_MAP = {
    "image/": "Images",
    "video/": "Video",
    "audio/": "Audio",
    "text/": "Documents",
    "application/pdf": "Documents",
    "application/msword": "Documents",
    "application/vnd.openxmlformats": "Documents",
    "application/zip": "Archives",
    "application/x-rar": "Archives",
    "application/gzip": "Archives",
}


def classify_local(filename: str, content_type: str) -> str:
    """Classify using file extension and MIME type — no API needed."""
    # Try extension first
    name_lower = filename.lower()
    for ext, category in EXTENSION_MAP.items():
        if name_lower.endswith(ext):
            return category

    # Try MIME type
    ct = (content_type or "").lower()
    for prefix, category in MIME_PREFIX_MAP.items():
        if ct.startswith(prefix):
            return category

    return "Other"


def classify_file(filename: str, content_type: str) -> str:
    """
    Classify a file using Gemini AI, with robust local fallback.
    Returns: 'Documents', 'Images', 'Audio', 'Video', 'Code', 'Archives', or 'Other'
    """
    if not api_key:
        return classify_local(filename, content_type)

    try:
        model = genai.GenerativeModel("gemini-3.5-flash")

        prompt = f"""You are a smart file classification AI.
Classify the file with name "{filename}" and MIME type "{content_type}" into one of the following exact categories:
- Documents
- Images
- Audio
- Video
- Code
- Archives
- Other

Respond with ONLY the category name. No other text, punctuation, or explanation."""

        response = model.generate_content(prompt)
        category = response.text.strip()

        valid_categories = ["Documents", "Images", "Audio", "Video", "Code", "Archives", "Other"]
        if category in valid_categories:
            return category

        # Fuzzy match
        for cat in valid_categories:
            if cat.lower() in category.lower():
                return cat

        return classify_local(filename, content_type)
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return classify_local(filename, content_type)

import re
from urllib.parse import urlparse, parse_qs

def extract_youtube_id(url):
    """
    Extract YouTube video ID from various URL formats.
    
    Supports:
    - https://www.youtube.com/watch?v=VIDEO_ID
    - https://youtu.be/VIDEO_ID
    - https://www.youtube.com/embed/VIDEO_ID
    - https://www.youtube.com/v/VIDEO_ID
    - https://www.youtube.com/shorts/VIDEO_ID
    """
    if not url:
        return None
    
    # Pattern for youtu.be short URLs
    if "youtu.be" in url:
        path = urlparse(url).path
        return path.lstrip("/")
    
    # Pattern for standard YouTube URLs
    if "youtube.com" in url:
        parsed = urlparse(url)
        
        # Handle /watch?v=VIDEO_ID
        if parsed.path == "/watch":
            query_params = parse_qs(parsed.query)
            return query_params.get("v", [None])[0]
        
        # Handle /embed/VIDEO_ID, /v/VIDEO_ID, /shorts/VIDEO_ID
        path_patterns = ["/embed/", "/v/", "/shorts/"]
        for pattern in path_patterns:
            if pattern in parsed.path:
                return parsed.path.split(pattern)[-1]
    
    # Try regex as fallback
    pattern = r'(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})'
    match = re.search(pattern, url)
    if match:
        return match.group(1)
    
    return None

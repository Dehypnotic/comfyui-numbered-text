from .nodes.numbered_text import NumberedText #  Nytt fil/klassenavn

NODE_CLASS_MAPPINGS = {
    # 1. Bevarer den gamle ID-en i overgangsperioden så ingen workflows krasjer
    "NumberedText": NumberedText, 
    
    # 2. Ditt nye offisielle og beskyttede flaggskip
    "dehypnotic_NumberedText": NumberedText
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "NumberedText": "NumberedText - DEPRECATED - REPLACE",
    "dehypnotic_NumberedText": "🧘 NumberedText (Dehypnotic)"
}

# 3. Forteller ComfyUI hvor den nye JavaScript-magien din ligger
WEB_DIRECTORY = "./js"

__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS", "WEB_DIRECTORY"]
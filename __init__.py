from .nodes.numbered_text_v2 import NumberedTextV2 # Antar dette blir ditt nye fil/klassenavn

NODE_CLASS_MAPPINGS = {
    # 1. Bevarer den gamle ID-en i overgangsperioden så ingen workflows krasjer
    "NumberedText": NumberedTextV2, 
    
    # 2. Ditt nye offisielle og beskyttede flaggskip
    "dehypnotic_NumberedTextV2": NumberedTextV2
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "NumberedText": "NumberedText V1 [DEPRECATED - REPLACE WITH V2]",
    "dehypnotic_NumberedTextV2": "NumberedText Interactive V2 (Dehypnotic)"
}

# 3. Forteller ComfyUI hvor den nye JavaScript-magien din ligger
WEB_DIRECTORY = "./js"

__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS", "WEB_DIRECTORY"]
from .numbered_text_node import NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS
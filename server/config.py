import os

# Paths
CURRENT_PATH = os.path.abspath(os.path.dirname(__file__))
PARENT_PATH = os.path.dirname(CURRENT_PATH)
BEIT3_PATH = os.path.join(CURRENT_PATH, 'beit3')

# Model paths
MODEL_PATH = os.path.join(CURRENT_PATH, "beit3-retrieval-pth", "beit3.spm")
MODEL_WEIGHT_PATH = os.path.join(
    CURRENT_PATH, "beit3-retrieval-pth", "beit3_base_patch16_384_f30k_retrieval.pth")

# MongoDB
MONGO_URI = 'mongodb+srv://cokain:2zE5rhXbasjtlPa8@vbs.hoqme.mongodb.net/'
DB_NAME = 'frames'
COLLECTION_NAME = 'links'

# Files
FRAME_IDS_FILE = os.path.join(CURRENT_PATH, 'qualifying_round_frame_ids.json')
FAISS_INDEX_FILE = os.path.join(
    CURRENT_PATH, 'qualifying_round_frame_embeddings_beit3.bin')

# Model parameters
MAX_LEN = 64

# Flask
DEBUG = True
PORT = 5000

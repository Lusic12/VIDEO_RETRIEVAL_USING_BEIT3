import numpy as np
from models import encode_text_query
from database import db
from utils import get_frame_ids_from_json, faiss_read_index
from config import FRAME_IDS_FILE, FAISS_INDEX_FILE


class SearchEngine:
    def __init__(self):
        self.frame_ids = get_frame_ids_from_json(FRAME_IDS_FILE)
        self.index = faiss_read_index(FAISS_INDEX_FILE)

    def search(self, query, limit):
        text_embedding = encode_text_query(query)
        D, I = self.index.search(
            np.array([text_embedding], dtype='float32'), limit)
        results = [(self.frame_ids[I[0][i]], D[0][i])
                   for i in range(limit) if 0 <= I[0][i] < len(self.frame_ids)]

        img_ids_with_scores = [(result[0], result[1]) for result in results]
        images = db.get_image([img_id for img_id, _ in img_ids_with_scores])
        # extract google drive links, watch url, frame stamp
        image_links = {
            img["image_id"]: img["google_drive_link"]
            for img in images
        }
        image_watch_urls = {
            img["image_id"]: img["watch_url"]
            for img in images
        }
        image_frame_stamps = {
            img["image_id"]: img["frame_stamp"]
            for img in images
        }

        img_list = [
            {
                "image_id": img_id,
                "link": image_links.get(img_id, ""),
                "score": float(score),
                "frame_stamp":  image_frame_stamps.get(img_id, ""),
                "watch_url": image_watch_urls.get(img_id, "")
            }
            for img_id, score in img_ids_with_scores
        ]
        img_list.sort(key=lambda x: x['score'], reverse=True)

        return img_list


search_engine = SearchEngine()

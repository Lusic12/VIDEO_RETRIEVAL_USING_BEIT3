import json
import faiss


def get_frame_ids_from_json(json_file_path):
    with open(json_file_path, 'r') as file:
        data = json.load(file)
        return [item['frame_id'] for item in data]


def faiss_read_index(faiss_index_path):
    return faiss.read_index(faiss_index_path)


def parse_frame_id(frame_id):
    parts = frame_id.split('_')
    return int(parts[0][1:]), int(parts[1][1:]), int(parts[2])

from functools import wraps
import json
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from search_engine import search_engine
from database import db
from utils import parse_frame_id
from config import DEBUG, PORT
import os
import redis

app = Flask(__name__)
cors = CORS(app)

os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

redis_client = redis.Redis(
    host='redis-17325.c292.ap-southeast-1-1.ec2.redns.redis-cloud.com',
    port=17325,
    password='nuIeWZEcHYzjf1fTb8OqfB2bPhF0HHXB')
def cache_result(expire_time=1800):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Create cache key 
            cache_key = f"{f.__name__}:{json.dumps(request.get_json())}"

            # Cache hit -> return cached result
            cached_result = redis_client.get(cache_key)
            if cached_result:
                return jsonify(json.loads(cached_result))

            # Cache miss -> compute result and cache it
            result = f(*args, **kwargs)
            redis_client.setex(cache_key, expire_time,
                               json.dumps(result.get_json()))
            return result
        return decorated_function
    return decorator

@app.route('/')
def home():
    return "Hello from AIO_Chef!"


@app.route('/search', methods=["POST"])
@cross_origin()
@cache_result(expire_time=1800)
def search():
    json_data = request.get_json()
    query = json_data['query']
    limit = json_data['limit']

    img_list = search_engine.search(query, limit)
    return jsonify({"item_count": len(img_list), "frames": img_list})


@app.route('/neighbor', methods=["POST"])
@cross_origin()
@cache_result(expire_time=1800)
def neighbor_search():
    json_data = request.get_json()
    frame_id = json_data['id']
    limit = json_data['limit']

    l, v, sequence_number = parse_frame_id(frame_id)

    frames = db.find_neighbors(l, v, sequence_number, limit)

    # No need to filter for unique frames as this is handled in find_neighbors

    img_list = []
    if frames:
        image_ids = [frame["image_id"] for frame in frames]
        images = db.get_image(image_ids)
        # extract google drive links, watch url, frame stamp
        image_links = {img["image_id"]: img["google_drive_link"]
                      for img in images}
        image_watch_urls = {img["image_id"]: img["watch_url"]
                            for img in images}
        image_frame_stamps = {img["image_id"]: img["frame_stamp"]
                              for img in images}
        
        img_list = [
            {
                "image_id": frame["image_id"],
                "link": image_links.get(frame["image_id"], ""),
                "sequence_number": frame["sequence_number"],
                "frame_stamp": image_frame_stamps.get(frame["image_id"], ""),
                "watch_url": image_watch_urls.get(frame["image_id"], "")
            }
            for frame in frames
        ]

    return jsonify({"item_count": len(img_list), "frames": img_list})


@app.route('/getBySequence', methods=["POST"])
@cross_origin()
@cache_result(expire_time=1800)
def get_img_by_sequence():
    json_data = request.get_json() 
    frame_ids = json_data['ids']
    img = db.get_image(frame_ids)
    
    return jsonify({"item_count": len(img), "frames": img})

@app.route('/getById', methods=["POST"])
@cross_origin()
@cache_result(expire_time=1800)
def get_img_by_id():
    json_data = request.get_json()
    frame_id = json_data['id']
    img = db.get_image([frame_id])

    return jsonify({"item_count": len(img), "frames": img})


if __name__ == '__main__':
    app.run(debug=DEBUG, port=PORT)

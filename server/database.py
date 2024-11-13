from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from config import MONGO_URI, DB_NAME, COLLECTION_NAME


class Database:
    def __init__(self):
        self.client = None
        self.db = None
        self.collection = None

    def connect(self):
        try:
            self.client = MongoClient(MONGO_URI)
            self.db = self.client[DB_NAME]
            self.collection = self.db[COLLECTION_NAME]
            print("Connected to MongoDB")
        except ConnectionFailure:
            print("Could not connect to MongoDB")

    def get_image(self, image_ids):
        return list(self.collection.find({"image_id": {"$in": image_ids}}, {"_id": 0}))

    def find_neighbors(self, l, v, sequence_number, limit=20):
        # Ensure limit is odd to include the middle frame
        if limit % 2 == 0:
            limit += 1

        half_limit = limit // 2

        # Get the middle frame
        middle_frame = self.collection.find_one(
            {"l": l, "v": v, "sequence_number": sequence_number},
            {"image_id": 1, "sequence_number": 1, "_id": 0}
        )

        if not middle_frame:
            return []  # Return empty list if middle frame not found

        # Get previous frames
        previous_frames = list(self.collection.find(
            {"l": l, "v": v, "sequence_number": {"$lt": sequence_number}},
            {"image_id": 1, "sequence_number": 1, "_id": 0}
        ).sort("sequence_number", -1).limit(half_limit))

        # Get next frames
        next_frames = list(self.collection.find(
            {"l": l, "v": v, "sequence_number": {"$gt": sequence_number}},
            {"image_id": 1, "sequence_number": 1, "_id": 0}
        ).sort("sequence_number", 1).limit(half_limit))

        # If we don't have enough frames on one side, get more from the other side
        if len(previous_frames) < half_limit:
            extra_next = half_limit - len(previous_frames)
            next_frames.extend(self.collection.find(
                {"l": l, "v": v, "sequence_number": {
                    "$gt": next_frames[-1]['sequence_number']}},
                {"image_id": 1, "sequence_number": 1, "_id": 0}
            ).sort("sequence_number", 1).limit(extra_next))
        elif len(next_frames) < half_limit:
            extra_prev = half_limit - len(next_frames)
            previous_frames.extend(self.collection.find(
                {"l": l, "v": v, "sequence_number": {
                    "$lt": previous_frames[-1]['sequence_number']}},
                {"image_id": 1, "sequence_number": 1, "_id": 0}
            ).sort("sequence_number", -1).limit(extra_prev))

        # Combine all frames and sort by sequence number
        all_frames = previous_frames + [middle_frame] + next_frames
        all_frames.sort(key=lambda x: x['sequence_number'])

        return all_frames


db = Database()
db.connect()

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

# Deloy BEIT3 for web server



## Make key frame use Trannetv2

A video consists of many frames sequenced together to form the video. However, when users retrieve a video, they often want to find a specific event in it. Many frames in a video may display the same scene, which makes them redundant and unnecessary.

We use **TransnetV2**, a model that can recognize scene transitions. For each scene, we select 4 keyframes: the first frame, the frame at 1/4 of the scene's duration, the frame at 3/4 of the scene's duration, and the final frame. And we save all frames on google drive.

## Get file path image for MonggoDB

All frames are stored on Google Drive. We extract the file paths, which are the links to the images on Google Drive, and save these links in MongoDB. When retrieving an image, we search for it in MongoDB, use the stored link to access the image on Google Drive, and visualize the image on the web.

## Encode images and extract embeddings for keyframe by BEIT3

Git clone [https://github.com/microsoft/unilm/beit3.git](https://github.com/microsoft/unilm.git) this model is encode images and extract embebddings, it same CLIP (Vision language model). Processes all keyframes from videos in the specified folder, extracts their embeddings, and saves them to a JSON Lines file.

## Save all embedding in FAISS

Faiss is vector Database. Faiss support some function as: stored embedding vectors and search embedding vector base on cosine similarity.

Therefore, we create a FlatIP FAISS index binary file from a JSON file containing feature vectors. The binary file will be saved in the same directory as the JSON file with the name **faiss_frame_embedding_cosine.bin**.


## Image Retrieval and Temporary Search

### 1. **Text-Based Image Retrieval**
- **Input:** A text query.
- **Process:** 
  - The input text is encoded into an embedding vector using a pre-trained text encoder (e.g., BEIT3 or CLIP).
  - Perform a search in the FAISS vector database to retrieve the top **k** results with the highest cosine similarity scores.
- **Output:** The top **k** image frames most relevant to the input query.

---

### 2. **Temporary Search**
- **Purpose:** Enhance retrieval by including nearby frames to provide more context around the event in the video.
- **Process:**
  - Once the top **k** frames are identified, retrieve their neighboring frames based on the frame sequence.
  - This helps users explore the visual context around the keyframes of interest.

---

### 3. **YouTube Video Mapping**
- **Additional Information:**
  - The mapping between frames and their corresponding video URLs on YouTube is stored in the database.
  - Each frame is linked with:
    - The **YouTube video URL**.
    - The **exact timestamp** corresponding to the frame.

- **Functionality:** 
  - After retrieving the keyframes, the user can directly watch the relevant portion of the video on YouTube by clicking a link or navigating to the timestamp.

---

### Workflow

1. **Input:** A text query.
2. **Encoding:** Convert the text query into an embedding vector.
3. **Search:** 
   - Use cosine similarity in the FAISS database to find the top **k** image frames.
   - Retrieve additional frames around the selected keyframes for temporary search.
4. **Mapping:** Map the retrieved frames to their corresponding YouTube URLs and timestamps.
5. **Visualization:** 
   - Display the frames with their similarity scores.
   - Provide clickable links to view the relevant video portions on YouTube.






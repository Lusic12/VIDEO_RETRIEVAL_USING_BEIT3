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



## Make key frame use Trannetvs

A video consists of many frames sequenced together to form the video. However, when users retrieve a video, they often want to find a specific event in it. Many frames in a video may display the same scene, which makes them redundant and unnecessary.

We use **TransnetV2**, a model that can recognize scene transitions. For each scene, we select 4 keyframes: the first frame, the frame at 1/4 of the scene's duration, the frame at 3/4 of the scene's duration, and the final frame.





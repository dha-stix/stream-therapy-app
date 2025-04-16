## Therapy Marketplace Application 
The app will allow clients to find therapists, chat, make payments, and book virtual therapy sessions. Firebase will handle the backend operation, while Stream will handle chat and video calls using its Chat SDK and Video & Audio API.

## Useful Links
[Article explaining the project]()

## Getting Started
- Clone the GitHub repository.
- Run `npm install` to install the project dependencies.
- Sign in and create a [Stream app](https://getstream.io/).
- Copy the app secret and API key into the `.env.local` file:
  ```env
  NEXT_PUBLIC_STREAM_API_KEY=<your_Stream_API_key>
  STREAM_SECRET_KEY=<your_Stream_Secret_key>
  ```
- Set up Firebase within the app and copy your Firebase config into the [`lib/firebase.ts`](https://github.com/dha-stix/stream-job-interview-app/blob/main/src/lib/firebase.example.ts) file.
- Set up Firebase Storage, Email and Password Authentication, and Firestore.
- Start the development server by running `npm run dev`.

## Tools
- [Firebase](https://firebase.google.com/)
- [Shadcn UI](https://ui.shadcn.com/docs/installation)
- [Stream Video and Audio SDK](https://getstream.io/video/docs/react/)
- [Stream Chat SDK](https://getstream.io/chat/docs/react/)
- Next.js and Tailwind CSS

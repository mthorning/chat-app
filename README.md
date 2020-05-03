# Chat App

I am making a chat app so that I can chat with my daughter safely online.
I am using node, express, passport, socket.io, redis and react.

A users json file needs to be added to the _server/mongo_ directory. The structure of the file is:

```
{
  "adults": [
     "john",
     "mary"
   ],
   "children": [
     tiny tim"
   ]
}
```

I am using Cloudinary to store images, there are some values required in a `.env` file for this and also the session secret:

```
SESSION_SECRET=****
CLOUDINARY_NAME=****
CLOUDINARY_KEY=****
CLOUDINARY_SECRET=****
```

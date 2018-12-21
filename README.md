# Chat App

I am making a chat app so that I can chat with my daughter from my computer at work.
I am using node, express, passport, socket.io, redis and react.

A users json file needs to be added to the _server/mongo_ directory. The structure of the file is as so:

```javascript
{
    "adults": [
        "jim",
        "jane",
    ],
    "children": [
        "barry",
        "lucy"
    ]
}
```

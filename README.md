# Chat App

I am making a chat app so that I can chat with my daughter from my computer at work.
I am using node, express, passport, socket.io, redis and react.

A users json file needs to be added to the _server_ directory. The structure of the file is as so:

```javascript
{
    "user1": {
        "password": "pass",
        "data": {
            "username": "user1",
            "displayName": "Matt"
        }
    }
}
```


# Redis Pub/Sub Testing

This repository contains a simple implementation of Redis Pub/Sub for WebSockets using Node.js with TypeScript. This is meant to circumvent the issue of multiple servers to transfer information and introduce scalability.

## Prerequisites

-   Node.js (>= 12.x)
-   Redis server
-   npm
-   docker 

## Setup

1.  **Clone the repository:**
    
    `git clone git@github.com:jlang61/redis-test.git
    cd <repository-directory>` 
    
2.  **Install dependencies:**
    
    `npm install` 
    
3.  **Ensure Redis server is running:**
    
    `redis-server`
    OR
    `docker run -d -p  6379:6379 redis`
    

## Folder Structure


├── src \
│   └── server.ts \
├── package.json \
└── README.md \


## Running the Code

### Starting server

    yarn start -p 3000

### Connect Websocket to Server (in a separate terminal)
    
    yarn wscat -c ws://localhost:3000/v1/ws

### Commands for Websocket 

    subscribe [channel-name]

    send [channel-name] [message]

    unsubscribe [channel-name]
   
    

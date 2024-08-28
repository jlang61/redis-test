
# Redis Pub/Sub Testing

This repository contains a simple implementation of Redis Pub/Sub using Node.js with TypeScript. The publish and subscribe functionality is located under `redisNode/publish` and `redisNode/subscribe` respectively.

## Prerequisites

-   Node.js (>= 12.x)
-   Redis server
-   npm

## Setup

1.  **Clone the repository:**
    
    `git clone git@github.com:jlang61/redis-test.git
    cd <repository-directory>` 
    
2.  **Install dependencies:**
    
    `npm install` 
    
3.  **Ensure Redis server is running:**
    
    `redis-server` 
    

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
   
    

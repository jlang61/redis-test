
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

.
├── redisNode
│   ├── publish
│   │   └── publisher.ts
│   ├── subscribe
│   │   └── subscriber.ts
├── package.json
├── tsconfig.json
└── README.md

## Running the Code

### Publisher

The publisher publishes an article message to the Redis channel named `article`.

1.  **Navigate to the publish directory:**
    
    `cd redisNode/publish` 
    
2.  **Compile the TypeScript file:**
    
    `npx tsc publisher.ts` 
    
3.  **Run the compiled JavaScript file:**
    
    `node publisher.js` 
    

### Subscriber

The subscriber listens to the Redis channel named `article` and logs any received messages.

1.  **Navigate to the subscribe directory:**
    
    `cd redisNode/subscribe` 
    
2.  **Compile the TypeScript file:**
    
    `npx tsc subscriber.ts` 
    
3.  **Run the compiled JavaScript file:**
    
     `node subscriber.js`

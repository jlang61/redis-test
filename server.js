"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const redis_1 = require("redis");
const wss = new ws_1.default.Server({ port: 8080 });
const redisClient = (0, redis_1.createClient)();
redisClient.on('error', (err) => console.error('Redis Client Error', err));
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield redisClient.connect();
    const subscriber = redisClient.duplicate();
    yield subscriber.connect();
    wss.on('connection', (ws) => {
        console.log('New client connected');
        ws.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(`Received message: ${message}`);
            yield redisClient.publish('channel', message);
        }));
        ws.on('close', () => {
            console.log('Client disconnected');
        });
    });
    subscriber.subscribe('channel', (message) => {
        wss.clients.forEach((client) => {
            if (client.readyState === ws_1.default.OPEN) {
                client.send(`Server received your message: ${message}`);
            }
        });
    });
}))();

import 'dotenv/config';

export default Object.freeze({
    DEV_SERVER_PORT: parseInt(process.env.DEV_SERVER_PORT ?? "3000"),
    WEB_SERVER_PORT: parseInt(process.env.WEB_SERVER_PORT ?? "3001"),
    WEB_SERVER_IP: process.env.WEB_SERVER_IP ?? "127.0.0.1",
} as const)
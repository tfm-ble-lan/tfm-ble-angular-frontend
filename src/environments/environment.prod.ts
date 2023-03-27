import { Environment } from "./environment";

export const environment: Environment = {
    production: true,
    apiUrl: process.env.API_URL || {{API_URL}},
    apiKey: process.env.ADMIN_API_KEY || {{API_KEY}},
};
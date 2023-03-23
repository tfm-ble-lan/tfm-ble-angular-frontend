import { Environment } from "./environment";

export const environment: Environment = {
  production: true,
  apiUrl: process.env.API_URL || 'http://192.168.0.16:4200/api',
  apiKey: process.env.ADMIN_API_KEY || '582K1D9FS-B2bFjfUbUf0w',
};


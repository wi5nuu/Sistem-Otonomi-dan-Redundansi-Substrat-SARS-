import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import bcrypt from 'bcrypt';
import { SignJWT, jwtVerify } from 'jose';
import { env } from '../config/env.js';

const SALT_ROUNDS = 12;
const secretKey = new TextEncoder().encode(env.JWT_SECRET);

async function authPlugin(fastify: FastifyInstance): Promise<void> {
  fastify.decorate('auth', {
    async hashPassword(password: string): Promise<string> {
      return bcrypt.hash(password, SALT_ROUNDS);
    },

    async verifyPassword(password: string, hash: string): Promise<boolean> {
      return bcrypt.compare(password, hash);
    },

    async createToken(payload: { userId: string; role: string }): Promise<string> {
      return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .setIssuer('sars-platform')
        .sign(secretKey);
    },

    async verifyToken(token: string): Promise<{ userId: string; role: string }> {
      const { payload } = await jwtVerify(token, secretKey, {
        issuer: 'sars-platform',
      });
      return payload as unknown as { userId: string; role: string };
    },
  });
}

export default fp(authPlugin, { name: 'sars-auth' });

declare module 'fastify' {
  interface FastifyInstance {
    auth: {
      hashPassword(password: string): Promise<string>;
      verifyPassword(password: string, hash: string): Promise<boolean>;
      createToken(payload: { userId: string; role: string }): Promise<string>;
      verifyToken(token: string): Promise<{ userId: string; role: string }>;
    };
  }
}

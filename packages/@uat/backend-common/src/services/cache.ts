/**
 * Cache Service (Redis)
 * RCF: REQ-014 (Next-Item Latency)
 */

import { createClient, type RedisClientType } from 'redis';

export interface CacheConfig {
  host: string;
  port: number;
  password?: string;
}

export class CacheService {
  private client: RedisClientType | null = null;
  private readonly config: CacheConfig;

  constructor(config: CacheConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    if (!this.client) {
      this.client = createClient({
        socket: {
          host: this.config.host,
          port: this.config.port,
        },
        password: this.config.password,
      });
      await this.client.connect();
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = null;
    }
  }

  async get(key: string): Promise<string | null> {
    if (!this.client) {
      throw new Error('Redis not connected. Call connect() first.');
    }
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (!this.client) {
      throw new Error('Redis not connected. Call connect() first.');
    }
    if (ttlSeconds) {
      await this.client.setEx(key, ttlSeconds, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async delete(key: string): Promise<void> {
    if (!this.client) {
      throw new Error('Redis not connected. Call connect() first.');
    }
    await this.client.del(key);
  }

  async getJson<T>(key: string): Promise<T | null> {
    const value = await this.get(key);
    return value ? (JSON.parse(value) as T) : null;
  }

  async setJson<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    await this.set(key, JSON.stringify(value), ttlSeconds);
  }

  isConnected(): boolean {
    return this.client !== null && this.client.isReady;
  }
}


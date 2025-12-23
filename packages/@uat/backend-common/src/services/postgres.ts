/**
 * PostgreSQL Service
 * RCF: REQ-019 (ACID Compliance)
 */

import { Pool, type PoolConfig, type QueryResult } from 'pg';

export interface PostgresConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  maxConnections?: number;
}

export class PostgresService {
  private pool: Pool | null = null;
  private readonly config: PoolConfig;

  constructor(config: PostgresConfig) {
    this.config = {
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
      max: config.maxConnections ?? 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    };
  }

  async connect(): Promise<void> {
    if (!this.pool) {
      this.pool = new Pool(this.config);
      // Test connection
      await this.pool.query('SELECT NOW()');
    }
  }

  async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
  }

  async query<T = unknown>(sql: string, params?: unknown[]): Promise<QueryResult<T>> {
    if (!this.pool) {
      throw new Error('PostgreSQL not connected. Call connect() first.');
    }
    return this.pool.query<T>(sql, params);
  }

  async transaction<T>(fn: (client: Pool) => Promise<T>): Promise<T> {
    if (!this.pool) {
      throw new Error('PostgreSQL not connected. Call connect() first.');
    }

    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await fn(this.pool);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  isConnected(): boolean {
    return this.pool !== null;
  }
}


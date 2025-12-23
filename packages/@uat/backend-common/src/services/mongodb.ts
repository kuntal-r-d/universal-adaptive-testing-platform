/**
 * MongoDB Service
 * RCF: REQ-004 (Dynamic Item Schema)
 */

import { MongoClient, type Db, type Collection, type Document } from 'mongodb';

export interface MongoDBConfig {
  uri: string;
  database?: string;
}

export class MongoDBService {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private readonly uri: string;
  private readonly databaseName: string;

  constructor(config: MongoDBConfig) {
    this.uri = config.uri;
    this.databaseName = config.database ?? 'adaptive_testing';
  }

  async connect(): Promise<void> {
    if (!this.client) {
      this.client = new MongoClient(this.uri);
      await this.client.connect();
      this.db = this.client.db(this.databaseName);
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
    }
  }

  getCollection<T extends Document = Document>(name: string): Collection<T> {
    if (!this.db) {
      throw new Error('MongoDB not connected. Call connect() first.');
    }
    return this.db.collection<T>(name);
  }

  getDatabase(): Db {
    if (!this.db) {
      throw new Error('MongoDB not connected. Call connect() first.');
    }
    return this.db;
  }

  isConnected(): boolean {
    return this.client !== null && this.db !== null;
  }
}


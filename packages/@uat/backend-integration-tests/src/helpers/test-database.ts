/**
 * Test Database Helper
 * RCF: Testing Infrastructure
 */

import { PostgresService, MongoDBService } from '@uat/backend-common';

export interface TestDatabaseOptions {
  postgres?: {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
  };
  mongodb?: {
    uri: string;
    database?: string;
  };
}

export class TestDatabase {
  private postgres: PostgresService | null = null;
  private mongodb: MongoDBService | null = null;

  constructor(private readonly options: TestDatabaseOptions) {}

  async setup(): Promise<void> {
    if (this.options.postgres) {
      this.postgres = new PostgresService(this.options.postgres);
      await this.postgres.connect();
    }

    if (this.options.mongodb) {
      this.mongodb = new MongoDBService({
        uri: this.options.mongodb.uri,
        database: this.options.mongodb.database ?? 'test_db',
      });
      await this.mongodb.connect();
    }
  }

  async teardown(): Promise<void> {
    if (this.postgres) {
      await this.postgres.disconnect();
      this.postgres = null;
    }

    if (this.mongodb) {
      await this.mongodb.disconnect();
      this.mongodb = null;
    }
  }

  async reset(): Promise<void> {
    // Reset PostgreSQL tables
    if (this.postgres) {
      await this.postgres.query('TRUNCATE exam_profiles, sessions, responses CASCADE');
    }

    // Reset MongoDB collections
    if (this.mongodb) {
      const db = this.mongodb.getDatabase();
      const collections = await db.listCollections().toArray();
      for (const collection of collections) {
        await db.collection(collection.name).deleteMany({});
      }
    }
  }

  getPostgres(): PostgresService | null {
    return this.postgres;
  }

  getMongoDB(): MongoDBService | null {
    return this.mongodb;
  }
}


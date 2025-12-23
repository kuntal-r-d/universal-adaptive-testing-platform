/**
 * Application Configuration
 */

export interface AppConfig {
  port: number;
  nodeEnv: string;
  database: {
    postgres: {
      host: string;
      port: number;
      database: string;
      user: string;
      password: string;
    };
    mongodb: {
      uri: string;
    };
  };
  redis: {
    host: string;
    port: number;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  logging: {
    level: string;
  };
}

export function getConfig(): AppConfig {
  return {
    port: parseInt(process.env['PORT'] ?? '3000', 10),
    nodeEnv: process.env['NODE_ENV'] ?? 'development',
    database: {
      postgres: {
        host: process.env['POSTGRES_HOST'] ?? 'localhost',
        port: parseInt(process.env['POSTGRES_PORT'] ?? '5432', 10),
        database: process.env['POSTGRES_DB'] ?? 'adaptive_testing',
        user: process.env['POSTGRES_USER'] ?? 'postgres',
        password: process.env['POSTGRES_PASSWORD'] ?? 'postgres',
      },
      mongodb: {
        uri: process.env['MONGODB_URI'] ?? 'mongodb://localhost:27017/adaptive_testing',
      },
    },
    redis: {
      host: process.env['REDIS_HOST'] ?? 'localhost',
      port: parseInt(process.env['REDIS_PORT'] ?? '6379', 10),
    },
    jwt: {
      secret: process.env['JWT_SECRET'] ?? 'development-secret',
      expiresIn: process.env['JWT_EXPIRES_IN'] ?? '24h',
    },
    logging: {
      level: process.env['LOG_LEVEL'] ?? 'debug',
    },
  };
}


/**
 * Test Server Helper
 * RCF: Testing Infrastructure
 */

import type { Express } from 'express';

export interface TestServerOptions {
  port?: number;
  silent?: boolean;
}

export class TestServer {
  private server: ReturnType<Express['listen']> | null = null;
  private readonly options: Required<TestServerOptions>;

  constructor(options: TestServerOptions = {}) {
    this.options = {
      port: options.port ?? 0, // Random available port
      silent: options.silent ?? true,
    };
  }

  async start(app: Express): Promise<{ url: string; port: number }> {
    return new Promise((resolve, reject) => {
      try {
        this.server = app.listen(this.options.port, () => {
          const address = this.server?.address();
          if (address && typeof address === 'object') {
            const url = `http://localhost:${address.port}`;
            if (!this.options.silent) {
              console.log(`Test server running at ${url}`);
            }
            resolve({ url, port: address.port });
          } else {
            reject(new Error('Failed to get server address'));
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          this.server = null;
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}


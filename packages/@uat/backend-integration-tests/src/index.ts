/**
 * Backend Integration Tests - Shared Test Infrastructure
 */

export { TestServer, type TestServerOptions } from './helpers/test-server.js';
export { TestDatabase, type TestDatabaseOptions } from './helpers/test-database.js';
export { generateTestData, type TestDataGenerators } from './generators/index.js';
export { CoverageTracker } from './coverage/index.js';


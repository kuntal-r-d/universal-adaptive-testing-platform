/**
 * Test Data Generators
 * RCF: Testing Infrastructure
 */

export interface TestDataGenerators {
  examProfile: ExamProfileGenerator;
  session: SessionGenerator;
  item: ItemGenerator;
}

interface ExamProfileGenerator {
  create(overrides?: Partial<ExamProfile>): ExamProfile;
  createMany(count: number): ExamProfile[];
}

interface SessionGenerator {
  create(examProfileId: string, overrides?: Partial<Session>): Session;
}

interface ItemGenerator {
  create(overrides?: Partial<Item>): Item;
  createPool(count: number): Item[];
}

interface ExamProfile {
  id: string;
  name: string;
  algorithm: string;
  scoringModel: string;
  status: string;
}

interface Session {
  id: string;
  examProfileId: string;
  userId: string;
  status: string;
  theta: number;
}

interface Item {
  id: string;
  stem: string;
  options: string[];
  difficulty: number;
  discrimination: number;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export const generateTestData: TestDataGenerators = {
  examProfile: {
    create(overrides = {}): ExamProfile {
      return {
        id: `exam-${generateId()}`,
        name: 'Test Exam Profile',
        algorithm: 'ITEM_ADAPTIVE',
        scoringModel: '3PL',
        status: 'ACTIVE',
        ...overrides,
      };
    },
    createMany(count: number): ExamProfile[] {
      return Array.from({ length: count }, (_, i) =>
        this.create({ name: `Test Exam Profile ${i + 1}` })
      );
    },
  },

  session: {
    create(examProfileId: string, overrides = {}): Session {
      return {
        id: `session-${generateId()}`,
        examProfileId,
        userId: `user-${generateId()}`,
        status: 'IN_PROGRESS',
        theta: 0.0,
        ...overrides,
      };
    },
  },

  item: {
    create(overrides = {}): Item {
      return {
        id: `item-${generateId()}`,
        stem: 'What is the capital of France?',
        options: ['London', 'Berlin', 'Paris', 'Madrid'],
        difficulty: 0.0,
        discrimination: 1.0,
        ...overrides,
      };
    },
    createPool(count: number): Item[] {
      return Array.from({ length: count }, (_, i) =>
        this.create({
          stem: `Test question ${i + 1}`,
          difficulty: (i - count / 2) / (count / 4), // Spread from -2 to 2
        })
      );
    },
  },
};


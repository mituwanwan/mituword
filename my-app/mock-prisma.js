// 模拟Prisma客户端用于测试
const mockPrisma = {
  user: {
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    create: () => Promise.resolve({}),
    update: () => Promise.resolve({}),
    delete: () => Promise.resolve({}),
  },
  profile: {
    findFirst: () => Promise.resolve(null),
    findMany: () => Promise.resolve([]),
    upsert: () => Promise.resolve({}),
  },
  project: {
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    count: () => Promise.resolve(0),
  },
  diary: {
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    count: () => Promise.resolve(0),
  },
  musicTrack: {
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
  },
  musicPlaylist: {
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
  },
  gitHubRepo: {
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    upsert: () => Promise.resolve({}),
  },
  gitHubSyncLog: {
    findFirst: () => Promise.resolve(null),
    create: () => Promise.resolve({}),
  },
  $disconnect: () => Promise.resolve(),
};

class PrismaClient {
  constructor() {
    return mockPrisma;
  }
}

module.exports = { PrismaClient };

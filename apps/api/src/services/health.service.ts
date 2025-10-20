import { Database } from '@alva/database';
import { createServiceLogger } from '@alva/utils';

const logger = createServiceLogger('health');

export class HealthService {
  constructor(private db: Database) {}

  async checkDatabase(): Promise<{ status: string; latency?: number }> {
    try {
      const start = Date.now();
      await this.db.execute('SELECT 1');
      const latency = Date.now() - start;

      return { status: 'healthy', latency };
    } catch (error) {
      logger.error('Database health check failed', { error });
      return { status: 'unhealthy' };
    }
  }

  async checkRedis(): Promise<{ status: string; latency?: number }> {
    try {
      const start = Date.now();
      // Add Redis health check logic here
      const latency = Date.now() - start;

      return { status: 'healthy', latency };
    } catch (error) {
      logger.error('Redis health check failed', { error });
      return { status: 'unhealthy' };
    }
  }

  async getOverallHealth(): Promise<{
    status: string;
    timestamp: string;
    services: Record<string, any>;
  }> {
    const [dbHealth, redisHealth] = await Promise.all([
      this.checkDatabase(),
      this.checkRedis(),
    ]);

    const allHealthy = [dbHealth, redisHealth].every(
      (service) => service.status === 'healthy'
    );

    return {
      status: allHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealth,
        redis: redisHealth,
      },
    };
  }
}

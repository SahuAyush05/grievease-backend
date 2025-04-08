import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from './Types';
import { logger } from './LoggerConfig';
import { container } from './InversifyConfig';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 20000; // 20 seconds

@injectable()
class DatabaseConfig {

  constructor(@inject(TYPES.PrismaClient) private prisma: PrismaClient) { }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public async connectToDatabase(): Promise<void> {
    let retryCount = 0;

    while (retryCount < MAX_RETRIES) {
      try {
        logger.info(`Attempting to connect to database. Attempt ${retryCount + 1}/${MAX_RETRIES}`);
        await this.prisma.$connect();
        logger.info("Successfully connected to database");
        return;
      } catch (error) {
        retryCount++;

        if (retryCount === MAX_RETRIES) {
          logger.error(`Failed to connect to database after ${MAX_RETRIES} attempts. Final error: ${(error as Error).message}`);
          throw new Error(`Database connection failed after ${MAX_RETRIES} attempts: ${(error as Error).message}`);
        }

        logger.warn(`Database connection attempt ${retryCount} failed. Error: ${(error as Error).message}`);
        logger.info(`Waiting ${RETRY_DELAY_MS / 1000} seconds before next retry...`);

        await this.delay(RETRY_DELAY_MS);
      }
    }
  }

  public async closeConnection(): Promise<void> {
    try {
      await this.prisma.$disconnect();
      logger.info("Database connection closed successfully");
    } catch (error: unknown) {
      logger.error(`Error closing database connection: ${(error as Error).message}`);
      throw error;
    }
  }
}

export { DatabaseConfig };

// Usage in your application startup
export async function initializeDatabase(): Promise<void> {

  const databaseConfig: DatabaseConfig = container.get<DatabaseConfig>(DatabaseConfig);

  try {
    await databaseConfig.connectToDatabase();
  } catch (error) {
    logger.error("Failed to initialize database connection");
    // You might want to exit the process here
    process.exit(1);
  }

  // Setup graceful shutdown
  process.on('SIGINT', async () => {
    logger.info('Received SIGINT. Closing database connection...');
    await databaseConfig.closeConnection();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    logger.info('Received SIGTERM. Closing database connection...');
    await databaseConfig.closeConnection();
    process.exit(0);
  });
}
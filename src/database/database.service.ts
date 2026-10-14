import { Injectable, OnModuleDestroy } from '@nestjs/common';
import pg from 'pg';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  });

  query<T extends pg.QueryResultRow>(text: string, params: unknown[] = []) {
    return this.pool.query<T>(text, params);
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import type { Connection } from 'mongoose';

@Injectable()
export class HealthService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  check() {
    return {
      api: 'ok',
      db: this.connection.readyState === 1 ? 'ok' : 'down',
    };
  }
}

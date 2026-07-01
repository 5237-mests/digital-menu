import { Injectable } from '@nestjs/common';
import type { HealthCheckResponse } from './health.types';

@Injectable()
export class HealthService {
  check(): HealthCheckResponse {
    return {
      status: 'ok',
      service: 'restaurant-api'
    };
  }
}

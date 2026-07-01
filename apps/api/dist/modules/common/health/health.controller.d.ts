import { HealthService } from './health.service';
import type { HealthCheckResponse } from './health.types';
export declare class HealthController {
    private readonly healthService;
    constructor(healthService: HealthService);
    check(): HealthCheckResponse;
}

import { Body, Controller, ForbiddenException, Headers, Post, UseGuards } from '@nestjs/common';
import { createHmac } from 'node:crypto';
import { Inject } from '@nestjs/common';
import type { Pool, ResultSetHeader } from 'mysql2/promise';
import { MYSQL_POOL } from '../database/database.constants';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { TenantContextService } from '../tenants/tenant-context.service';

/** Provider boundary: Chapa checkout initialization/verification can be enabled without changing subscription logic. */
@Controller('billing')
export class BillingController {
  constructor(@Inject(MYSQL_POOL) private readonly pool: Pool, private readonly tenantContext: TenantContextService) {}

  @Post('webhooks/chapa')
  async chapaWebhook(@Headers('x-chapa-signature') xSignature: string | undefined, @Headers('chapa-signature') chapaSignature: string | undefined, @Body() payload: Record<string, unknown>) {
    const secret = process.env.CHAPA_WEBHOOK_SECRET;
    const signature = xSignature ?? chapaSignature;
    if (!secret || !signature) throw new ForbiddenException('Invalid Chapa signature');
    const expected = createHmac('sha256', secret).update(JSON.stringify(payload)).digest('hex');
    if (signature !== expected) throw new ForbiddenException('Invalid Chapa signature');
    const eventKey = String(payload.reference ?? payload.tx_ref ?? '');
    if (!eventKey) throw new ForbiddenException('Missing Chapa reference');
    const [result] = await this.pool.execute<ResultSetHeader>('INSERT IGNORE INTO billing_webhook_events (provider, event_key, payload, processed_at) VALUES (\'chapa\', ?, ?, NOW())', [eventKey, JSON.stringify(payload)]);
    return { received: true, duplicate: Number(result.affectedRows) === 0 };
  }

  @Post('renewal/intent')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  async renewalIntent() {
    const tenantId = this.tenantContext.requireId();
    // Automatic recurring Chapa charges remain disabled until merchant capability is confirmed.
    return { tenantId, provider: 'chapa', recurringEnabled: process.env.CHAPA_RECURRING_ENABLED === 'true', status: 'provider_configuration_required' };
  }
}

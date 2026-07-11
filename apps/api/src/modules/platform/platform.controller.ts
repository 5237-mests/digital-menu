import { Body, Controller, Get, Headers, Post, UseGuards, UnauthorizedException, ConflictException } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UsersService } from '../users/users.service';
import { TenantsService } from '../tenants/tenants.service';

@Controller()
export class PlatformController {
  constructor(private readonly tenants: TenantsService, private readonly users: UsersService) { }

  @Get('setup/platform-admin')
  setupInstructions() {
    return {
      message: 'Create the initial platform administrator with POST /setup/platform-admin.',
      requiredHeaders: ['Content-Type: application/json', 'X-Setup-Secret: <PLATFORM_SETUP_SECRET>'],
      requiredBody: { name: 'Platform Admin', email: 'admin@example.com', password: 'strong password' }
    };
  }

  @Post('setup/platform-admin')
  async setup(@Headers('x-setup-secret') secret: string | undefined, @Body() body: { name: string; email: string; password: string }) {
    console.log('Setup request received with secret:', secret);
    console.log('Environment PLATFORM_SETUP_SECRET:', process.env);
    if (!process.env.PLATFORM_SETUP_SECRET || secret !== process.env.PLATFORM_SETUP_SECRET) throw new UnauthorizedException('Invalid setup secret');
    if (await this.users.findByEmail(body.email)) throw new ConflictException('Email already in use');
    return this.users.create({ ...body, role: 'PLATFORM_ADMIN', tenantId: null });
  }

  @Get('platform/tenants')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PLATFORM_ADMIN')
  list() { return this.tenants.findAll(); }

  @Post('platform/tenants')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PLATFORM_ADMIN')
  async provision(@Body() body: { name: string; slug: string; ownerName: string; ownerEmail: string; ownerPassword: string }) {
    const tenant = await this.tenants.create(body.name, body.slug.toLowerCase());
    const owner = await this.users.create({ name: body.ownerName, email: body.ownerEmail, password: body.ownerPassword, role: 'OWNER', tenantId: tenant.id });
    return { tenant, owner };
  }
}

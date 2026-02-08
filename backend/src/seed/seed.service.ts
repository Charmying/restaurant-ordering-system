import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../modules/users/users.service';
import { UserRole } from '../modules/users/enums/user-role.enum';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly usersService: UsersService) {}

  async seed() {
    await this.seedSuperAdmin();
    this.logger.log('Database seeding completed');
  }

  private async seedSuperAdmin() {
    const existing = await this.usersService.findByUsername('charmy');
    if (existing) {
      this.logger.log('Superadmin already exists, skipping');
      return;
    }

    await this.usersService.createSystemUser({
      username: 'charmy',
      password: 'Charmying',
      role: UserRole.Superadmin,
    });

    this.logger.log('Seeded superadmin user');
  }
}

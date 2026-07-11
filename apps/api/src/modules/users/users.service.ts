import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { UsersRepository } from './repositories/users.repository';
import type { PublicUser, UserRole } from './types/user-record';
import { toPublicUser } from './types/user-record';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findAll(): Promise<PublicUser[]> {
    const users = await this.usersRepository.findAll();
    return users.map(toPublicUser);
  }

  async findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  async findPublicById(id: number): Promise<PublicUser | null> {
    const user = await this.usersRepository.findById(id);
    return user ? toPublicUser(user) : null;
  }

  async create(data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    tenantId?: number | null;
  }): Promise<PublicUser> {
    const existing = await this.usersRepository.findByEmail(data.email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }
    const passwordHash = await hash(data.password, 12);
    const user = await this.usersRepository.create({
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role,
      tenantId: data.tenantId
    });
    return toPublicUser(user);
  }

  async update(id: number, data: {
    name?: string;
    email?: string;
    password?: string;
    role?: UserRole;
  }): Promise<PublicUser> {
    if (data.email) {
      const existing = await this.usersRepository.findByEmail(data.email);
      if (existing && existing.id !== id) {
        throw new ConflictException('Email already in use');
      }
    }

    const passwordHash = data.password ? await hash(data.password, 12) : undefined;
    const user = await this.usersRepository.update(id, {
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role
    });

    return toPublicUser(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.usersRepository.delete(id);
  }
}

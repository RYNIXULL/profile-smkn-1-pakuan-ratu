import { prisma } from '../config/database';
import { hashPassword } from '../utils/password';
import { logAudit } from './audit.service';

export async function getAllUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: { select: { id: true, name: true, displayName: true } },
      avatarUrl: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });
}

export async function getAllRoles() {
  return prisma.role.findMany({
    orderBy: { name: 'asc' },
  });
}

export async function createUser(data: any, authorId: string, ipAddress?: string, userAgent?: string) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new Error('Email sudah terdaftar dalam sistem.');

  const passwordHash = await hashPassword(data.password);

  const created = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
      roleId: data.roleId,
      isActive: true,
    },
    include: { role: true },
  });

  await logAudit({
    userId: authorId,
    action: 'CREATE',
    resource: 'users',
    resourceId: created.id,
    details: { name: created.name, email: created.email, role: created.role.name },
    ipAddress,
    userAgent,
  });

  return {
    id: created.id,
    name: created.name,
    email: created.email,
    role: created.role,
    isActive: created.isActive,
  };
}

export async function updateUser(
  id: string,
  data: any,
  authorId: string,
  ipAddress?: string,
  userAgent?: string
) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { role: true },
  });
  if (!user) throw new Error('Pengguna tidak ditemukan.');

  // Protect last active Super Admin from deactivation or role change
  if (user.role.name === 'SUPER_ADMIN') {
    if (data.isActive === false || (data.roleId && data.roleId !== user.roleId)) {
      const superAdminCount = await prisma.user.count({
        where: { role: { name: 'SUPER_ADMIN' }, isActive: true },
      });
      if (superAdminCount <= 1) {
        throw new Error('Tidak dapat menonaktifkan atau mengubah role Super Administrator terakhir!');
      }
    }
  }

  const updateData: any = {};
  if (data.name) updateData.name = data.name;
  if (data.email) updateData.email = data.email;
  if (data.roleId) updateData.roleId = data.roleId;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;
  if (data.password) {
    updateData.passwordHash = await hashPassword(data.password);
  }

  const updated = await prisma.user.update({
    where: { id },
    data: updateData,
    include: { role: true },
  });

  await logAudit({
    userId: authorId,
    action: 'UPDATE',
    resource: 'users',
    resourceId: id,
    details: { changes: Object.keys(data), targetUser: updated.email },
    ipAddress,
    userAgent,
  });

  return {
    id: updated.id,
    name: updated.name,
    email: updated.email,
    role: updated.role,
    isActive: updated.isActive,
  };
}

export async function deleteUser(id: string, authorId: string, ipAddress?: string, userAgent?: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { role: true },
  });
  if (!user) throw new Error('Pengguna tidak ditemukan.');

  if (user.role.name === 'SUPER_ADMIN') {
    const superAdminCount = await prisma.user.count({
      where: { role: { name: 'SUPER_ADMIN' } },
    });
    if (superAdminCount <= 1) {
      throw new Error('Dilarang menghapus Super Administrator terakhir di dalam sistem!');
    }
  }

  await prisma.user.delete({ where: { id } });

  await logAudit({
    userId: authorId,
    action: 'DELETE',
    resource: 'users',
    resourceId: id,
    details: { email: user.email },
    ipAddress,
    userAgent,
  });
}

export async function getAuditLogs(limit = 100) {
  return prisma.auditLog.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });
}

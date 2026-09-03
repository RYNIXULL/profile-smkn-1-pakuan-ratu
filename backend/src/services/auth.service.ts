import { prisma } from '../config/database';
import { verifyPassword, hashPassword } from '../utils/password';
import { generateToken, TokenPayload } from '../utils/jwt';
import { logAudit } from './audit.service';
import crypto from 'crypto';

export async function loginService(params: {
  email: string;
  password: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  const user = await prisma.user.findUnique({
    where: { email: params.email },
    include: { role: true },
  });

  if (!user || !user.isActive) {
    await logAudit({
      userId: user?.id,
      action: 'FAILED_LOGIN',
      resource: 'auth',
      details: { email: params.email, reason: 'Pengguna tidak ditemukan atau dinonaktifkan' },
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
    });
    throw new Error('Email atau password salah.');
  }

  const isPasswordValid = await verifyPassword(params.password, user.passwordHash);
  if (!isPasswordValid) {
    await logAudit({
      userId: user.id,
      action: 'FAILED_LOGIN',
      resource: 'auth',
      details: { email: params.email, reason: 'Password salah' },
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
    });
    throw new Error('Email atau password salah.');
  }

  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role.name,
    name: user.name,
  };

  const token = generateToken(payload);
  const sessionToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // Store active session
  await prisma.session.create({
    data: {
      userId: user.id,
      token: sessionToken,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      expiresAt,
    },
  });

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  await logAudit({
    userId: user.id,
    action: 'LOGIN',
    resource: 'auth',
    details: { email: user.email, role: user.role.name },
    ipAddress: params.ipAddress,
    userAgent: params.userAgent,
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name,
      roleDisplayName: user.role.displayName,
      avatarUrl: user.avatarUrl,
    },
    token,
    sessionToken,
  };
}

export async function logoutService(userId: string, sessionToken?: string, ipAddress?: string, userAgent?: string) {
  if (sessionToken) {
    await prisma.session.deleteMany({
      where: { token: sessionToken },
    });
  }

  await logAudit({
    userId,
    action: 'LOGOUT',
    resource: 'auth',
    ipAddress,
    userAgent,
  });
}

export async function getMeService(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      role: {
        include: {
          permissions: {
            include: { permission: true },
          },
        },
      },
    },
  });

  if (!user || !user.isActive) {
    throw new Error('Pengguna tidak ditemukan atau telah dinonaktifkan.');
  }

  const permissions = user.role.permissions.map((p) => `${p.permission.resource}:${p.permission.action}`);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role.name,
    roleDisplayName: user.role.displayName,
    avatarUrl: user.avatarUrl,
    permissions,
  };
}

export async function changePasswordService(params: {
  userId: string;
  currentPassword: string;
  newPassword: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  const user = await prisma.user.findUnique({ where: { id: params.userId } });
  if (!user) throw new Error('Pengguna tidak ditemukan.');

  const isMatch = await verifyPassword(params.currentPassword, user.passwordHash);
  if (!isMatch) throw new Error('Password lama tidak sesuai.');

  const newHash = await hashPassword(params.newPassword);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: newHash },
  });

  await logAudit({
    userId: user.id,
    action: 'PASSWORD_CHANGE',
    resource: 'users',
    resourceId: user.id,
    ipAddress: params.ipAddress,
    userAgent: params.userAgent,
  });
}

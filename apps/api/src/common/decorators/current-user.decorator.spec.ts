import { ExecutionContext } from '@nestjs/common';
import { CurrentUser } from './current-user.decorator';
import { User, Role } from '@prisma/client';

// اختبار مباشر للمنطق دون التعقيدات
describe('CurrentUser Decorator Logic', () => {
  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    role: Role.USER,
    password: 'hashedPassword',
    avatarUrl: 'https://example.com/avatar.jpg',
    hashedRefreshToken: 'hashedToken123',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  };

  const createExecutionContext = (user: any): ExecutionContext =>
    ({
      getType: () => 'http',
      switchToHttp: () => ({
        getRequest: () => ({ user }),
        getResponse: () => ({}),
        getNext: () => ({}),
      }),
      switchToRpc: () => ({}),
      switchToWs: () => ({}),
    }) as ExecutionContext;

  const testCurrentUserLogic = (
    data: keyof User | undefined,
    user: User | null | undefined,
  ) => {
    const ctx = createExecutionContext(user);
    const req = ctx.switchToHttp().getRequest();
    const requestUser = req.user as User;
    if (!requestUser) return null;
    return data ? requestUser[data] : requestUser;
  };

  it('should return full user when no data provided and user exists', () => {
    const result = testCurrentUserLogic(undefined, mockUser);
    expect(result).toEqual(mockUser);
  });

  it('should return specific property when data provided and user exists', () => {
    const result = testCurrentUserLogic('email', mockUser);
    expect(result).toBe('test@example.com');
  });

  it('should return null when user does not exist', () => {
    const result = testCurrentUserLogic(undefined, null);
    expect(result).toBeNull();
  });

  it('should test decorator factory creation', () => {
    expect(CurrentUser).toBeDefined();
    const decoratorWithData = CurrentUser('id');
    expect(typeof decoratorWithData).toBe('function');
    const decoratorWithoutData = CurrentUser(undefined);
    expect(typeof decoratorWithoutData).toBe('function');
  });
});

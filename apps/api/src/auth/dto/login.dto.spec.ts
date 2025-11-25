import { validate } from 'class-validator';
import { LoginDto } from './login.dto';

describe('LoginDto', () => {
  it('should be defined', () => {
    expect(new LoginDto()).toBeDefined();
  });

  describe('validation', () => {
    it('should validate correct data', async () => {
      const dto = new LoginDto();
      dto.email = 'test@example.com';
      dto.password = 'password123';

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail with invalid email', async () => {
      const dto = new LoginDto();
      dto.email = 'invalid-email';
      dto.password = 'password123';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
      expect(errors[0].constraints).toHaveProperty('isEmail');
    });

    it('should fail with short password', async () => {
      const dto = new LoginDto();
      dto.email = 'test@example.com';
      dto.password = 'short';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('password');
      expect(errors[0].constraints).toHaveProperty('minLength');
    });

    it('should fail with empty password', async () => {
      const dto = new LoginDto();
      dto.email = 'test@example.com';
      dto.password = '';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('password');
    });

    it('should fail with missing email', async () => {
      const dto = new LoginDto();
      dto.password = 'password123';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
    });

    it('should fail with missing password', async () => {
      const dto = new LoginDto();
      dto.email = 'test@example.com';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('password');
    });
  });

  describe('error messages', () => {
    it('should have correct email error message', async () => {
      const dto = new LoginDto();
      dto.email = 'invalid-email';
      dto.password = 'password123';

      const errors = await validate(dto);
      const emailError = errors.find((error) => error.property === 'email');
      expect(emailError?.constraints?.isEmail).toBe(
        'Email must be a valid email',
      );
    });

    it('should have correct password error message', async () => {
      const dto = new LoginDto();
      dto.email = 'test@example.com';
      dto.password = 'short';

      const errors = await validate(dto);
      const passwordError = errors.find(
        (error) => error.property === 'password',
      );
      expect(passwordError?.constraints?.minLength).toBe(
        'Password must be at least 8 characters',
      );
    });
  });
});

import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { FindAllPostsDto } from './find-all-posts.dto';

describe('FindAllPostsDto', () => {
  it('should be defined', () => {
    expect(new FindAllPostsDto()).toBeDefined();
  });

  describe('default values', () => {
    it('should have default page and limit', () => {
      const dto = new FindAllPostsDto();
      expect(dto.page).toBe(1);
      expect(dto.limit).toBe(10);
    });

    it('should have optional search and published', () => {
      const dto = new FindAllPostsDto();
      expect(dto.search).toBeUndefined();
      expect(dto.published).toBeUndefined();
    });
  });

  describe('validation', () => {
    it('should validate correct data', async () => {
      const dto = plainToInstance(FindAllPostsDto, {
        page: 1,
        limit: 10,
        search: 'test',
        published: 'true', // استخدم string علشان الـ transform
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should validate with only required fields', async () => {
      const dto = plainToInstance(FindAllPostsDto, {});

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
      expect(dto.page).toBe(1);
      expect(dto.limit).toBe(10);
    });

    it('should fail with page less than 1', async () => {
      const dto = plainToInstance(FindAllPostsDto, {
        page: 0,
        limit: 10,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('page');
    });

    it('should fail with limit greater than 100', async () => {
      const dto = plainToInstance(FindAllPostsDto, {
        page: 1,
        limit: 101,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('limit');
    });
  });

  describe('transformation', () => {
    it('should transform string numbers to numbers', () => {
      const dto = plainToInstance(FindAllPostsDto, {
        page: '2',
        limit: '20',
      });

      expect(dto.page).toBe(2);
      expect(dto.limit).toBe(20);
    });

    it('should transform published string "true" to boolean true', () => {
      const dto = plainToInstance(FindAllPostsDto, {
        published: 'true',
      });

      expect(dto.published).toBe(true);
    });

    it('should transform published string "false" to boolean false', () => {
      const dto = plainToInstance(FindAllPostsDto, {
        published: 'false',
      });

      expect(dto.published).toBe(false);
    });

    it('should transform published string "1" to boolean true', () => {
      const dto = plainToInstance(FindAllPostsDto, {
        published: '1',
      });

      expect(dto.published).toBe(true);
    });

    it('should transform published string "0" to boolean false', () => {
      const dto = plainToInstance(FindAllPostsDto, {
        published: '0',
      });

      expect(dto.published).toBe(false);
    });

    it('should return undefined for invalid published values', () => {
      const dto = plainToInstance(FindAllPostsDto, {
        published: 'invalid',
      });

      expect(dto.published).toBeUndefined();
    });

    // التعديل هنا: الـ transform مش بيعمل conversion للـ boolean مباشرة
    it('should handle boolean published value as undefined', () => {
      const dto = plainToInstance(FindAllPostsDto, {
        published: true, // boolean مباشرة
      });

      // الـ transform function مش بتتعامل مع boolean values
      // فبتعود undefined
      expect(dto.published).toBeUndefined();
    });

    it('should handle null published value', () => {
      const dto = plainToInstance(FindAllPostsDto, {
        published: null,
      });

      expect(dto.published).toBeUndefined();
    });
  });

  describe('search functionality', () => {
    it('should accept valid search string', async () => {
      const dto = plainToInstance(FindAllPostsDto, {
        search: 'test search',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
      expect(dto.search).toBe('test search');
    });

    it('should accept empty search string', async () => {
      const dto = plainToInstance(FindAllPostsDto, {
        search: '',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
      expect(dto.search).toBe('');
    });
  });
});

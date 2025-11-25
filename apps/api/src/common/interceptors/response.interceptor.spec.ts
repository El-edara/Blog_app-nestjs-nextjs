import { Test, TestingModule } from '@nestjs/testing';
import { ResponseInterceptor } from './response.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';

describe('ResponseInterceptor', () => {
  let interceptor: ResponseInterceptor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResponseInterceptor],
    }).compile();

    interceptor = module.get<ResponseInterceptor>(ResponseInterceptor);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  describe('intercept', () => {
    let mockExecutionContext: ExecutionContext;
    let mockCallHandler: CallHandler;

    beforeEach(() => {
      mockExecutionContext = {} as ExecutionContext;
      mockCallHandler = {
        handle: jest.fn(),
      };
    });

    it('should wrap normal data in response format', (done) => {
      const mockData = { id: 1, name: 'Test' };
      mockCallHandler.handle = jest.fn().mockReturnValue(of(mockData));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (result) => {
          expect(result).toEqual({
            success: true,
            timestamp: expect.any(String),
            data: mockData,
          });
          done();
        },
      });
    });

    it('should handle paginated data without extra wrapping', (done) => {
      const paginatedData = {
        data: [{ id: 1 }, { id: 2 }],
        meta: {
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      };

      mockCallHandler.handle = jest.fn().mockReturnValue(of(paginatedData));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (result) => {
          expect(result).toEqual({
            success: true,
            timestamp: expect.any(String),
            ...paginatedData,
          });
          done();
        },
      });
    });

    it('should handle null data', (done) => {
      mockCallHandler.handle = jest.fn().mockReturnValue(of(null));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (result) => {
          expect(result).toEqual({
            success: true,
            timestamp: expect.any(String),
            data: null,
          });
          done();
        },
      });
    });

    it('should handle string data', (done) => {
      const stringData = 'Hello World';
      mockCallHandler.handle = jest.fn().mockReturnValue(of(stringData));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (result) => {
          expect(result).toEqual({
            success: true,
            timestamp: expect.any(String),
            data: 'Hello World',
          });
          done();
        },
      });
    });
  });
});

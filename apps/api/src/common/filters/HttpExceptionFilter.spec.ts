import { Test, TestingModule } from '@nestjs/testing';
import { ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { HttpExceptionsFilter } from './HttpExceptionFilter';

describe('HttpExceptionsFilter', () => {
  let filter: HttpExceptionsFilter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpExceptionsFilter],
    }).compile();

    filter = module.get<HttpExceptionsFilter>(HttpExceptionsFilter);
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  describe('catch', () => {
    let mockResponse: Partial<Response>;
    let mockArgumentsHost: ArgumentsHost;

    beforeEach(() => {
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      mockArgumentsHost = {
        switchToHttp: jest.fn().mockReturnValue({
          getResponse: jest.fn().mockReturnValue(mockResponse),
        }),
      } as unknown as ArgumentsHost;
    });

    it('should handle HttpException', () => {
      const exception = new HttpException('Not Found', 404);

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Not Found',
        statusCode: 404,
      });
    });

    it('should handle generic Error', () => {
      const exception = new Error('Something went wrong');

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Something went wrong',
        statusCode: 500,
      });
    });

    it('should handle unknown exception with default message', () => {
      const exception = 'Unknown error';

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error',
        statusCode: 500,
      });
    });
  });
});

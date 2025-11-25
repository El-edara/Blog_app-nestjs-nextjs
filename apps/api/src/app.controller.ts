<<<<<<< HEAD
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  public getHello(): string {
    return 'Hello World!';
  }
}
=======
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
>>>>>>> 8006af993e19f2f99d00d8f719249b05777cdf47

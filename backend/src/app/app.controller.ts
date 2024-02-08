import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('app')
@Controller('/')
export class AppController {
  @Get()
  public getApp() {
    return {
      success: true,
      message: 'Hello, world!'
    }
  }
}
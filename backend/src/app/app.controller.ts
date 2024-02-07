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
  
  @Get('.well-known/acme-challenge/-mgjsjmTlGb9XlZrtP63sM4gULLAV5LV0JBYnf0lxoQ')
  public getCert() {
    return '-mgjsjmTlGb9XlZrtP63sM4gULLAV5LV0JBYnf0lxoQ.oKp5y60gfprTCSn0HgGjLyyp0xJUkHLaAJ-XuF-eGNM'
  }
}
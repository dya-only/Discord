import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthGuard } from 'src/auth/auth.guard'
import { FilesService } from './files.service'
import { Response } from 'express'

@Controller('files')
@ApiTags('Files')
@UseGuards(AuthGuard)
export class FilesController {
  constructor(
    private filesService: FilesService
  ) {}

  @Get('avatar/:filename')
  getAvatar(@Res() res: Response, @Param('filename') filename: string) {
    return this.filesService.avatar(res, filename)
  }

  @Get('events/:filename')
  getLogo(@Res() res: Response, @Param('filename') filename: string) {
    return this.filesService.events(res, filename)
  }
}
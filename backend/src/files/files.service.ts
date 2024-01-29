import { Injectable } from '@nestjs/common'
import { Response } from 'express'
import { join } from 'path'

@Injectable()
export class FilesService {
  avatar(res: Response, filename: string) {
    return res.sendFile(join(process.cwd(), `dist/uploads/avatar/${filename}`))
  }

  async events(res: Response, filename: string) {
    return res.sendFile(join(process.cwd(), `dist/uploads/events/${filename}`))
  }
}

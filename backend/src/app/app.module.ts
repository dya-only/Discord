import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthMiddleware } from '../auth/auth.middleware'
import { AuthModule } from 'src/auth/auth.module'
import { UsersModule } from 'src/users/users.module'
import { ConfigurationModule } from '../configuration/configuration.module'
import { EventsModule } from 'src/events/events.module'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DATABASE_HOST', 'db'),
        port: configService.get('DATABASE_PORT', 3306),
        username: configService.get('DATABASE_USERNAME', 'nestuser'),
        password: configService.get('DATABASE_PASSWORD', 'nestpassword'),
        database: configService.get('DATABASE_SCHEMA', 'nest'),
        synchronize: configService.get('DATABASE_SYNCHRONIZE', true),
        autoLoadEntities: true
      })
    }),
    ConfigurationModule,
    UsersModule,
    AuthModule,
    EventsModule
  ]
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('*')
  }
}
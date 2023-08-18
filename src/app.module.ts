import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './api/users/users.module';
import { TracksModule } from './api/tracks/tracks.module';
import { ArtistsModule } from './api/artists/artists.module';
import { AlbumsModule } from './api/albums/albums.module';
import { FavoritesModule } from './api/favorites/favorites.module';
import { LoggingModule } from './logging/logging.module';
import { toNumber } from './shared/helpers/to-number';
import { LoggingMiddleware } from './logging/logging.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: 'postgres',
        username: configService.get('PGUSER', 'hls-user'),
        password: configService.get('PGPASSWORD', 'hls-password'),
        host: configService.get('PGHOST', 'localhost'),
        port: toNumber(configService.get('PGPORT')) ?? 5432,
        database: configService.get('PGDATABASE', 'hls-db'),
        synchronize: false,
        entities: [`${__dirname}/**/*.entity.js`],
        migrations: [`${__dirname}/database/migrations/*.js`],
        migrationsRun: true,
      }),
    }),
    UsersModule,
    TracksModule,
    ArtistsModule,
    AlbumsModule,
    FavoritesModule,
    LoggingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}

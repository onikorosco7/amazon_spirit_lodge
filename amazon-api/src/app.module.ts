import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsModule } from './rooms/rooms.module';
import { UsersModule } from './users/users.module';
import { BookingsModule } from './bookings/bookings.module';
import { AuthModule } from './auth/auth.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ContactModule } from './contact/contact.module';
import { GalleryModule } from './gallery/gallery.module';
import { HeroModule } from './hero/hero.module';
import { BlogModule } from './blog/blog.module';
import { DownloadsModule } from './downloads/downloads.module';
import { TeamModule } from './team/team.module';
import { TermsModule } from './terms/terms.module';
import { PrivacyModule } from './privacy/privacy.module';
import { MessagesModule } from './messages/messages.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';
import { PromotionsModule } from './promotions/promotions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    RoomsModule,
    UsersModule,
    BookingsModule,
    AuthModule,
    ReviewsModule,
    ContactModule,
    GalleryModule,
    HeroModule,
    BlogModule,
    DownloadsModule,
    TeamModule,
    TermsModule,
    PrivacyModule,
    MessagesModule,
    PromotionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

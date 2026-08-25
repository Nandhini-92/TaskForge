import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import {
  databaseConfig,
  redisConfig,
  authConfig,
  billingConfig,
  mailConfig,
  envValidationSchema,
} from './config';
import { DatabaseModule } from './infrastructure/database/database.module';
import { RedisModule } from './infrastructure/redis';
import { CacheModule } from './infrastructure/cache';
import { QueueProducerModule } from './infrastructure/queue';
import { ThrottlerStorage } from '@nestjs/throttler';
import { ThrottlerRedisStorage } from './infrastructure/redis/throttler-redis.storage';

// Guards
import { CustomThrottlerGuard } from './common/guards/custom-throttler.guard';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { OrgMembershipGuard } from './common/guards/org-membership.guard';
import { RolesGuard } from './common/guards/roles.guard';

// Business modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { ActivityModule } from './modules/activity/activity.module';
import { RealtimeModule } from './modules/realtime/realtime.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { BillingModule } from './modules/billing/billing.module';
import { MailModule } from './modules/mail/mail.module';
import { HealthModule } from './modules/health/health.module';
import { AiModule } from './modules/ai/ai.module';

import { RequestIdMiddleware } from './common/middleware/request-id.middleware';

@Module({
  imports: [
    // Global config
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        redisConfig,
        authConfig,
        billingConfig,
        mailConfig,
      ],
      validationSchema: envValidationSchema,
      validationOptions: { abortEarly: false },
    }),

    // Database
    DatabaseModule,

    // Structured logging
    LoggerModule.forRoot({
      pinoHttp: {
        genReqId: (req) => req.headers['x-request-id'] as string,
        transport:
          process.env.NODE_ENV === 'development'
            ? {
                target: 'pino-pretty',
                options: { colorize: true },
              }
            : undefined,
        autoLogging: true,
        quietReqLogger: true,
      },
    }),

    // Health checks
    HealthModule,

    // Event bus
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
    }),

    // Infrastructure
    RedisModule,
    CacheModule,

    // Rate limiting
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60000, limit: 100 }],
    }),

    // Business modules
    AuthModule,
    UsersModule,
    OrganizationsModule,
    ProjectsModule,
    TasksModule,
    ActivityModule,
    RealtimeModule,
    NotificationsModule,
    BillingModule,
    MailModule,

    // AI
    AiModule,

    // Queue producers
    QueueProducerModule,
  ],

  providers: [
    { provide: ThrottlerStorage, useClass: ThrottlerRedisStorage },
    { provide: APP_GUARD, useClass: CustomThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: OrgMembershipGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*path');
  }
}
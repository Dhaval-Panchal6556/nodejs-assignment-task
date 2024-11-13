import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard } from "@nestjs/throttler";
import { UsersModule } from "./users/users.module";
import { LoggerModule } from "./common/logger/logger.module";
import { AuthModule } from "./security/auth/auth.module";
import { JwtAuthGuard } from "./security/auth/guards/jwt-auth.guard";
import { DatabaseModule } from "./providers/database/mongo/database.module";
import { ThrottleModule } from "./security/throttle/throttle.module";
import AppConfiguration from "./config/app.config";
import DatabaseConfiguration from "./config/database.config";
import AuthConfiguration from "./config/auth.config";
import { MongooseModule } from "@nestjs/mongoose";
import { Users, UsersSchema } from "./users/schemas/user.schema";
import { CustomExceptionFilter } from "./common/exceptions/http-exception.filter";
import { JwtService } from "@nestjs/jwt";
import { userAuthMiddleware } from "./common/middleware/userAuth.middleware";
import { ProjectManagementModule } from "./project-management/project-management.module";
import { TaskModule } from "./task/task.module";
import { AuthenticationModule } from "./authentication/authentication.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [AppConfiguration, DatabaseConfiguration, AuthConfiguration],
      ignoreEnvFile: false,
      isGlobal: true,
    }),
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
    DatabaseModule,
    LoggerModule,
    AuthModule,
    ThrottleModule,
    UsersModule,
    TaskModule,
    ProjectManagementModule,
    AuthenticationModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
    JwtService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(userAuthMiddleware).forRoutes("/admin/*");
    consumer.apply(userAuthMiddleware).forRoutes("/users/*");
  }
}

import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { LoggerModule } from "src/common/logger/logger.module";
import { JwtStrategy } from "src/security/auth/strategies/jwt.strategy";

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get("auth.secret"),
        signOptions: {
          expiresIn: configService.get<number>("auth.expiresIn", 60),
        },
      }),
    }),
    LoggerModule,
  ],
  providers: [JwtStrategy, JwtService],
  controllers: [],
  exports: [],
})
export class AuthModule {}

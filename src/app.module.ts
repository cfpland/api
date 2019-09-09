import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { CliModule } from './cli/cli.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [ApiModule, CliModule, ConfigModule],
})
export class AppModule {}

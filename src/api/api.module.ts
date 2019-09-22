import { CacheModule, Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { ConferencesController } from './controllers/conferences.controller';
import { JwtModule } from '@nestjs/jwt';
import { OptionalAuthGuard } from './auth/optional-auth-guard';
import { AuthService } from './auth/auth.service';
import { HttpStrategy } from './auth/http.strategy';
import { ConferenceCacheInterceptor } from './interceptors/conference-cache.interceptor';
import { ConferenceDatesInterceptor } from './interceptors/conference-dates.interceptor';
import { DataAccessModule } from '../data-access/data-access.module';
import { SearchesController } from './controllers/searches.controller';
import { SavedConferencesController } from './controllers/saved-conferences.controller';
import { AbstractsController } from './controllers/abstracts.controller';
import { TrackedConferencesController } from './controllers/tracked-conferences.controller';
import { EmailTrackingController } from './controllers/email-tracking.controller';

@Module({
  controllers: [
    ConferencesController,
    UsersController,
    SearchesController,
    SavedConferencesController,
    AbstractsController,
    TrackedConferencesController,
    EmailTrackingController,
  ],
  imports: [
    CacheModule.register({
      ttl: 20,
      max: 20,
    }),
    JwtModule.register({
      publicKey: Buffer.from(
        process.env.AUTH0_PUBLIC_KEY_BASE_64 || '',
        'base64',
      ),
      verifyOptions: { algorithms: ['RS256'] },
    }),
    DataAccessModule,
  ],
  providers: [
    AuthService,
    HttpStrategy,
    OptionalAuthGuard,
    ConferenceCacheInterceptor,
    ConferenceDatesInterceptor,
  ],
})
export class ApiModule {}

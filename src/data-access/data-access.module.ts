import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './users/services/user.service';
import { MoonclerkApiClientService } from './users/clients/moonclerk-api-client.service';
import { User } from './users/entities/user.entity';
import { SavedConference } from './saved-conferences/entities/saved-conference.entity';
import { SubscribersService } from './subscribers/subscribers.service';
import { subscribersClientProvider } from './providers/subscribers-client-provider';
import { SearchService } from './searches/services/search.service';
import { Search } from './searches/entities/search.entity';
import { PostsService } from './posts/posts.service';
import { RssParserPostsClientService } from './posts/clients/rss-parser-posts-client.service';
import { ConferencesService } from './conferences/services/conferences.service';
import { AirtableConferencesClientService } from './conferences/clients/airtable-conferences-client.service';
import { ExternalConferencesService } from './conferences/services/external-conferences.service';
import { CallingAllPapersClientService } from './conferences/clients/calling-all-papers-client.service';
import { CfpTimeClientService } from './conferences/clients/cfp-time-client.service';
import { ConfstechClientService } from './conferences/clients/confstech-client.service';
import { MicrolinkClient } from './conference-enhancements/clients/microlink-client.service';
import { ConferenceEnhancementsService } from './conference-enhancements/conference-enhancements.service';
import { LocationsService } from './locations/locations.service';
import { GeonamesClientService } from './locations/clients/geonames-client.service';
import { RestcountriesClientService } from './locations/clients/restcountries-client.service';
import { SavedConferencesService } from './saved-conferences/saved-conferences.service';
import { AbstractEntity } from './abstracts/abstract.entity';
import { AbstractEntityService } from './abstracts/abstract-entity.service';
import { TrackedConference } from './tracked-conferences/tracked-conference.entity';
import { TrackedConferencesService } from './tracked-conferences/tracked-conferences.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.ENVIRONMENT === 'develop',
      keepConnectionAlive: true,
    }),
    TypeOrmModule.forFeature([
      User,
      SavedConference,
      Search,
      AbstractEntity,
      TrackedConference,
    ]),
  ],
  providers: [
    AirtableConferencesClientService,
    CallingAllPapersClientService,
    CfpTimeClientService,
    ConferenceEnhancementsService,
    ConferencesService,
    ConfstechClientService,
    ExternalConferencesService,
    GeonamesClientService,
    LocationsService,
    MicrolinkClient,
    MoonclerkApiClientService,
    PostsService,
    RestcountriesClientService,
    RssParserPostsClientService,
    SearchService,
    subscribersClientProvider,
    SubscribersService,
    SavedConferencesService,
    UserService,
    AbstractEntityService,
    TrackedConferencesService,
  ],
  exports: [
    ConferencesService,
    ConferenceEnhancementsService,
    LocationsService,
    PostsService,
    SearchService,
    SubscribersService,
    SavedConferencesService,
    UserService,
    AbstractEntityService,
    TrackedConferencesService,
  ],
})
export class DataAccessModule {}

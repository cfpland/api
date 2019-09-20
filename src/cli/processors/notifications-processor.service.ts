import { Injectable, Logger } from '@nestjs/common';
import { SubscriberDto } from '../../data-access/subscribers/dtos/subscriber.dto';
import { ConferenceDto } from '../../data-access/conferences/dtos/conference.dto';
import { BlogPostInterface } from '../../data-access/posts/interfaces/blog-post.interface';
import { EmailBuilderService } from '../../shared/modules/email-builder/services/email-builder.service';
import { User } from '../../data-access/users/entities/user.entity';
import * as moment from 'moment';
import { collect } from '../../shared/functions/collect';
import { Search } from '../../data-access/searches/entities/search.entity';
import { SearchWithConferences } from '../../data-access/searches/interfaces/search-with-conferences.interface';
import { UserConference } from '../../data-access/user-conferences/entities/user-conference.entity';
import { UserAccountSummaryInterface } from '../../shared/interfaces/user-account-summary.interface';
import { getRandomElements } from '../../shared/functions/get-random-elements';
import { EmailSenderService } from '../../shared/modules/email-sender/services/email-sender.service';
import { SenderResultDto } from '../../shared/modules/email-sender/dtos/sender-result.dto';
import { Collection } from '../../data-access/interfaces/collection.interface';
import { TrackedConference } from '../../data-access/tracked-conferences/tracked-conference.entity';

@Injectable()
export class NotificationsProcessorService {
  constructor(
    private builder: EmailBuilderService,
    private sender: EmailSenderService,
  ) {}

  public async processWeeklySubscriberNewsletter(
    subscribers: Collection<SubscriberDto>,
    conferences: Collection<ConferenceDto>,
    blogPosts: Collection<BlogPostInterface>,
  ): Promise<SenderResultDto[]> {
    const results = [];

    // Processes subscribers in series, so it's slow, but keeps memory usage small
    for (const subscriber of subscribers.items) {
      try {
        const email = this.builder.buildWeeklySubscriberNewsletter(
          subscriber,
          conferences,
          blogPosts,
        );

        results.push(
          await this.sender.sendWeeklySubscriberNewsletter(email, subscriber),
        );
      } catch (e) {
        Logger.error(e);
      }
    }

    return Promise.resolve(results);
  }

  public async processSavedConferencesNotifications(
    users: Collection<User>,
    conferences: Collection<ConferenceDto>,
  ): Promise<SenderResultDto[]> {
    const results = [];

    for (const user of users.items) {
      try {
        const savedUserConferences = collect(
          this.filterSavedUserConferencesReadyForNotifications(
            user.savedConferences,
            conferences,
          ),
        );

        if (savedUserConferences && savedUserConferences.total > 0) {
          const email = this.builder.buildSavedConferencesNotificationEmail(
            user,
            savedUserConferences,
          );

          results.push(
            await this.sender.sendSavedConferencesEmail(email, user),
          );
        }
      } catch (e) {
        Logger.error(e);
      }
    }

    return Promise.resolve(results);
  }

  public async processSavedSearchNotifications(
    users: Collection<User>,
    conferences: Collection<ConferenceDto>,
  ): Promise<SenderResultDto[]> {
    const results = [];

    for (const user of users.items) {
      try {
        const searches = this.getSearchesWithNewConferences(
          user.searches,
          conferences,
        );

        if (searches && searches.total > 0) {
          const email = this.builder.buildSavedSearchesNotificationEmail(
            user,
            searches,
          );

          results.push(await this.sender.sendSavedSearchesEmail(email, user));
        }
      } catch (e) {
        Logger.error(e);
      }
    }

    return Promise.resolve(results);
  }

  public async processUserSummary(
    users: Collection<User>,
    conferences: Collection<ConferenceDto>,
  ): Promise<SenderResultDto[]> {
    const results = [];

    for (const user of users.items) {
      try {
        const summary = this.getUserAccountSummary(
          user.savedConferences,
          conferences,
          user.trackedConferences,
        );
        const email = this.builder.buildWeeklySummaryEmail(user, summary);

        results.push(await this.sender.sendWeeklySummaryEmail(email, user));
      } catch (e) {
        Logger.error(e);
      }
    }

    return Promise.resolve(results);
  }

  private getUserAccountSummary(
    userConferences: UserConference[],
    conferences: Collection<ConferenceDto>,
    trackedConferences: TrackedConference[],
  ): UserAccountSummaryInterface {
    const proCfps = conferences.items.filter(
      conference =>
        (conference.hotel_covered || conference.travel_covered) &&
        conference.cfp_days_until >= 21,
    );
    const randomConferences =
      proCfps.length > 10 ? getRandomElements(proCfps, 10) : proCfps;
    const openCfpSelection = collect(randomConferences);

    return {
      acceptedCfpsCount: trackedConferences
        .filter(userConference => userConference.status === 'accepted')
        .length,
      appliedCfpsCount: trackedConferences
        .filter(userConference => userConference.status === 'applied')
        .length,
      openCfpCount: conferences.total,
      openCfpSelection,
      savedCfpsCount: userConferences.length,
    };
  }

  private getSearchesWithNewConferences = (
    searches: Search[],
    conferences: Collection<ConferenceDto>,
  ): Collection<SearchWithConferences> => {
    return collect(
      searches
        .map(search => ({
          search,
          conferences: collect(
            conferences.items.filter(
              conference =>
                this.conferenceMatchesSearch(conference, search) &&
                this.conferenceIsNew(conference),
            ),
          ),
        }))
        .filter(search => search.conferences.total > 0),
    );
  };

  private conferenceMatchesSearch = (
    conference: ConferenceDto,
    search: Search,
  ): boolean => {
    const match = [];

    if (search.options) {
      if (search.options.category) {
        match.push(
          search.options.category === conference.category.toLowerCase(),
        );
      }
      if (search.options.region) {
        match.push(search.options.region === conference.region.toLowerCase());
      }
      if (search.options.hotel_covered) {
        match.push(conference.hotel_covered);
      }
      if (search.options.travel_covered) {
        match.push(conference.travel_covered);
      }
      if (search.options.stipend_covered) {
        match.push(conference.stipend_covered);
      }
      if (search.options.event_start_date_after) {
        match.push(
          moment(conference.event_start_date).diff(
            moment(search.options.event_start_date_after),
          ) > 0,
        );
      }
      if (search.options.event_start_date_before) {
        match.push(
          moment(conference.event_start_date).diff(
            moment(search.options.event_start_date_before),
          ) < 0,
        );
      }
    }

    return match.reduce((p, c) => p && c, match.length > 0);
  };

  private conferenceIsNew = (conference: ConferenceDto): boolean =>
    [1, 9].includes(conference.created_days_back);

  private filterSavedUserConferencesReadyForNotifications = (
    userConferences,
    conferences,
  ): ConferenceDto[] =>
    userConferences
      .map(userConference =>
        conferences.items.find(
          conference => conference.providerId === userConference.atConferenceId,
        ),
      )
      .filter(c => c)
      .filter(this.dueDateInNotificationDays);

  private dueDateInNotificationDays = (conference: ConferenceDto): boolean => {
    const daysToCheck = [21, 7, 2];
    const daysTillDue = moment(conference.cfp_due_date).diff(
      moment.now(),
      'days',
    );
    return daysToCheck.includes(daysTillDue);
  };
}

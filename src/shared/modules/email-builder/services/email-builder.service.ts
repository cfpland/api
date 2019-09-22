import { Injectable, Logger } from '@nestjs/common';
import { EmailDto } from '../dtos/email.dto';
import { SubscriberDto } from '../../../../data-access/subscribers/dtos/subscriber.dto';
import { ConferenceDto } from '../../../../data-access/conferences/dtos/conference.dto';
import { SubscriberConferenceService } from './subscriber-conference.service';
import handlebars = require('handlebars');
import handbarsHelpers = require('handlebars-helpers');
import mjml2html = require('mjml');
import { weeklyMjmlTemplate } from '../templates/weekly';
import { savedConferencesNotificationTemplate } from '../templates/saved-conferences-notification';
import { BlogPostInterface } from '../../../../data-access/posts/interfaces/blog-post.interface';
import minifier = require('html-minifier');
import * as moment from 'moment';
import { User } from '../../../../data-access/users/entities/user.entity';
import { SearchWithConferences } from '../../../../data-access/searches/interfaces/search-with-conferences.interface';
import { savedSearchesNotificationTemplate } from '../templates/saved-searches-notification';
import { UserAccountSummaryInterface } from '../../../interfaces/user-account-summary.interface';
import { weeklyUserSummaryTemplate } from '../templates/weekly-user-summary';
import { Collection } from '../../../../data-access/interfaces/collection.interface';

@Injectable()
export class EmailBuilderService {
  private readonly handlebars: any;
  private readonly minifier: any;
  private readonly minifierOptions = {
    collapseBooleanAttributes: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
  };

  public constructor(
    private readonly subscriberConference: SubscriberConferenceService,
  ) {
    handbarsHelpers({ handlebars });
    this.handlebars = handlebars;
    this.minifier = minifier;
  }

  public buildWeeklySubscriberNewsletter(
    subscriber: SubscriberDto,
    conferences: Collection<ConferenceDto>,
    blogPosts?: Collection<BlogPostInterface>,
  ): EmailDto {
    conferences = this.subscriberConference.preferenceSort(
      subscriber,
      conferences,
    );

    return {
      subject: this.getWeeklySubscriberNewsletterSubjectLine(),
      html: this.getNotificationHtml(weeklyMjmlTemplate, {
        subscriber,
        conferences,
        blogPosts,
      }),
    };
  }

  public buildSavedConferencesNotificationEmail(
    user: User,
    conferences: Collection<ConferenceDto>,
  ): EmailDto {
    return {
      subject: this.getSavedConferencesNotificationEmailSubjectLine(
        conferences.total,
      ),
      html: this.getNotificationHtml(savedConferencesNotificationTemplate, {
        user,
        conferences,
      }),
    };
  }

  public buildSavedSearchesNotificationEmail(
    user: User,
    searches: Collection<SearchWithConferences>,
  ): EmailDto {
    return {
      subject: this.getSavedSearchesNotificationEmailSubjectLine(
        searches.total,
      ),
      html: this.getNotificationHtml(savedSearchesNotificationTemplate, {
        user,
        searches,
      }),
    };
  }

  public buildWeeklySummaryEmail(
    user: User,
    summary: UserAccountSummaryInterface,
  ): EmailDto {
    return {
      subject: this.getWeeklyUserSummarySubjectLine(),
      html: this.getNotificationHtml(weeklyUserSummaryTemplate, {
        user,
        summary,
      }),
    };
  }

  private getNotificationHtml(template: string, inputs: any): string {
    const mjmlTemplate = this.handlebars.compile(template);
    const mjmlContent = mjmlTemplate(inputs);

    if (process.env.DEBUG_MJML === 'true') {
      Logger.debug(mjmlContent);
    }

    return this.minifyHtml(mjml2html(mjmlContent).html);
  }

  private minifyHtml = (html: string): string =>
    this.minifier.minify(html, this.minifierOptions);

  private getWeeklySubscriberNewsletterSubjectLine(): string {
    const today = moment().format('LL');
    return `Upcoming Conference CFPs for ${today}`;
  }

  private getSavedConferencesNotificationEmailSubjectLine(
    closing: number,
  ): string {
    return `${closing} of Your Saved Conferences have CFPs closing soon`;
  }

  private getSavedSearchesNotificationEmailSubjectLine(
    searchCount: number,
  ): string {
    return `New conferences found for ${searchCount} of your Saved Searches`;
  }

  private getWeeklyUserSummarySubjectLine(): string {
    const today = moment().format('LL');
    return `CFP Land Pro Summary for ${today}`;
  }
}

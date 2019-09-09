import { Controller, Logger } from '@nestjs/common';
import { ConferencesService } from '../../data-access/conferences/services/conferences.service';
import { UserService } from '../../data-access/users/services/user.service';
import { SubscribersService } from '../../data-access/subscribers/subscribers.service';
import { PostsService } from '../../data-access/posts/posts.service';
import { NotificationsProcessorService } from '../processors/notifications-processor.service';
import { SenderResultDto } from '../../shared/modules/email-sender/dtos/sender-result.dto';

@Controller('notifications')
export class NotificationsController {
  private blogPostLimit = 1;

  constructor(
    private readonly conferencesService: ConferencesService,
    private readonly userService: UserService,
    private readonly subscribersService: SubscribersService,
    private readonly postsService: PostsService,
    private readonly processor: NotificationsProcessorService,
  ) {}

  public async sendSavedConferenceNotifications(): Promise<
    SenderResultDto[] | undefined
  > {
    try {
      const users = await this.userService
        .getUsersSubscribedToSavedConferences()
        .toPromise();
      const conferences = await this.conferencesService.getInternal({
        atView: 'closing_in_21',
      });

      return this.processor.processSavedConferencesNotifications(
        users,
        conferences,
      );
    } catch (e) {
      Logger.error(e);
    }
  }

  public async sendSavedSearchNotifications(): Promise<
    SenderResultDto[] | undefined
  > {
    try {
      const users = await this.userService
        .getUsersSubscribedToSavedSearches()
        .toPromise();
      const conferences = await this.conferencesService.getInternal({
        atView: 'closing_in_42',
      });

      return this.processor.processSavedSearchNotifications(users, conferences);
    } catch (e) {
      Logger.error(e);
    }
  }

  public async sendUserSummary(): Promise<SenderResultDto[] | undefined> {
    try {
      const users = await this.userService
        .getUsersSubscribedToWeeklySummary()
        .toPromise();
      const conferences = await this.conferencesService.getInternal({
        atView: 'closing_in_42',
      });

      return this.processor.processUserSummary(users, conferences);
    } catch (e) {
      Logger.error(e);
    }
  }

  public async sendWeeklySubscriberNewsletter(): Promise<
    SenderResultDto[] | undefined
  > {
    const subscribers = await this.subscribersService.getAll().toPromise();
    Logger.log(`${subscribers.total} Subscribers queued for delivery.`);

    try {
      const conferences = await this.conferencesService.getInternal({
        atView: 'closing_in_21',
      });
      Logger.log(`${conferences.total} Conferences with CFPs due soon.`);

      const blogPosts = await this.postsService
        .getAll({ limit: this.blogPostLimit })
        .toPromise();
      Logger.log(`${blogPosts.total} Blog posts found.`);

      return this.processor.processWeeklySubscriberNewsletter(
        subscribers,
        conferences,
        blogPosts,
      );
    } catch (e) {
      Logger.error(e);
    }
  }
}

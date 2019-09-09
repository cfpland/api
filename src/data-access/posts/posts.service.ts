import { Injectable } from '@nestjs/common';
import { BlogPostInterface } from './interfaces/blog-post.interface';
import { RssParserPostsClientService } from './clients/rss-parser-posts-client.service';
import { Collection } from '../interfaces/collection.interface';
import { GetAllDataService } from '../interfaces/data-service.interface';
import { ConfigService } from '../../config/config.service';
import { Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { map } from 'rxjs/operators';
import { Options } from '../interfaces/options.interface';
import { collect } from '../../shared/functions/collect';
import { GetAllPostsOptions } from './interfaces/get-all-posts-options.interface';

@Injectable()
export class PostsService implements GetAllDataService<BlogPostInterface> {
  private postFeedUrl: string;

  constructor(
    private readonly postsClient: RssParserPostsClientService,
    private readonly config: ConfigService,
  ) {
    this.postFeedUrl = this.config.get('POST_FEED_URL');
  }

  public getAll(
    options: GetAllPostsOptions,
  ): Observable<Collection<BlogPostInterface>> {
    return fromPromise(this.postsClient.get(this.postFeedUrl)).pipe(
      map(posts => this.filterWithOptions(posts, options)),
    );
  }

  private filterWithOptions = (
    posts: Collection<BlogPostInterface>,
    options: Options<BlogPostInterface>,
  ): Collection<BlogPostInterface> => {
    if (options.limit !== undefined) {
      posts = this.trimPosts(posts, options);
    }

    return posts;
  };

  private trimPosts = (
    posts: Collection<BlogPostInterface>,
    options: Options<BlogPostInterface>,
  ): Collection<BlogPostInterface> =>
    collect(posts.items.slice(0, Number(options.limit)));
}

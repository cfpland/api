import { Injectable } from '@nestjs/common';
import Parser = require('rss-parser');
import { BlogPostInterface } from '../interfaces/blog-post.interface';
import { collect } from '../../../shared/functions/collect';
import { Collection } from '../../interfaces/collection.interface';

@Injectable()
export class RssParserPostsClientService {
  private parser: any;

  public constructor() {
    this.parser = new Parser();
  }

  public async get(url: string): Promise<Collection<BlogPostInterface>> {
    const feed = await this.parser.parseURL(url);
    let items = [];

    if (feed.items !== undefined && feed.items.length > 0) {
      items = feed.items.map(this.feedItemToBlogPostDto);
    }

    return collect(items);
  }

  private feedItemToBlogPostDto = (feedItem: any): BlogPostInterface => ({
    content: feedItem.content,
    link: feedItem.link,
    publishedDate: feedItem.pubDate,
    title: feedItem.title,
    image: this.getImage(feedItem),
  });

  private getImage = (feedItem: any): string | undefined =>
    feedItem.enclosure && feedItem.enclosure.url
      ? feedItem.enclosure.url
      : undefined;
}

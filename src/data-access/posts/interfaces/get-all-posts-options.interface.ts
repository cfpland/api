import { Options } from '../../interfaces/options.interface';
import { BlogPostInterface } from './blog-post.interface';

export interface GetAllPostsOptions extends Options<BlogPostInterface> {
  limit: number;
}

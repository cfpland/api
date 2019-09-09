import { Request } from 'express';
import { User } from '../../data-access/users/entities/user.entity';

export type RequestWithUser = Request & { user: User };

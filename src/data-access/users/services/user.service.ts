import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../validation/create-user.dto';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { fromPromise } from 'rxjs/internal-compatibility';
import { map, tap } from 'rxjs/operators';
import { collect } from '../../../shared/functions/collect';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { defaultCommunicationPreferences } from '../validation/user-communication-preferences.dto';
import { MoonclerkApiClientService } from '../clients/moonclerk-api-client.service';
import { userAccountLevelsArray } from '../types/user-account-level.type';
import { Collection } from '../../interfaces/collection.interface';
import { UserAccount } from '../../accounts/user-account.entity';

const defaultUserAccount: DeepPartial<UserAccount> = {
  role: 'owner',
  account: {
    type: 'free',
  },
};

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly moonclerkApiClient: MoonclerkApiClientService,
  ) {}

  public selectBy = (key: string, value: string) => {
    const where = {};
    where[key] = value;
    const relations = [
      'savedConferences',
      'trackedConferences',
      'trackedConferences.abstracts',
      'userAccounts',
      'userAccounts.account',
    ];
    return this.userRepository.findOne({ where, relations });
  };

  public createUser = (userDto: CreateUserDto): Observable<User> => {
    if (!userDto.communicationPreferences) {
      userDto.communicationPreferences = defaultCommunicationPreferences;
    }
    const user = this.userRepository.create({...userDto, userAccounts: [defaultUserAccount]});

    return this.saveUser(user);
  };

  public getUsersSubscribedToSavedConferences = (): Observable<
    Collection<User>
  > => {
    return fromPromise(
      this.userRepository
        .createQueryBuilder('user')
        .select()
        .leftJoinAndSelect('user.savedConferences', 'savedConferences')
        .where(
          `user.communicationPreferences ::jsonb @> \'{"savedConferences":true}\'`,
        )
        .where('user.accountLevel = :accountLevel', { accountLevel: 'pro' })
        .getMany(),
    ).pipe(map(collect));
  };

  public getUsersSubscribedToSavedSearches = (): Observable<
    Collection<User>
  > => {
    return fromPromise(
      this.userRepository
        .createQueryBuilder('user')
        .select()
        .leftJoinAndSelect('user.searches', 'searches')
        .where(
          `user.communicationPreferences ::jsonb @> \'{"savedSearches":true}\'`,
        )
        .where('user.accountLevel = :accountLevel', { accountLevel: 'pro' })
        .getMany(),
    ).pipe(map(collect));
  };

  public getUsersSubscribedToWeeklySummary = (): Observable<
    Collection<User>
  > => {
    return fromPromise(
      this.userRepository
        .createQueryBuilder('user')
        .select()
        .leftJoinAndSelect('user.savedConferences', 'savedConferences')
        .where(
          `user.communicationPreferences ::jsonb @> \'{"weeklySummary":true}\'`,
        )
        .where('user.accountLevel = :accountLevel', { accountLevel: 'pro' })
        .getMany(),
    ).pipe(map(collect));
  };

  public saveUser = (user: User): Observable<User> =>
    fromPromise(this.userRepository.save(user));

  public getUserPaymentStatus = (user: User): Observable<any> => {
    // Get all users who have checked out in the past 30 days
    const options = {
      // checkout_from: moment()
      //   .subtract(30, 'days')
      //   .format('YYYY-MM-DD'),
      // checkout_to: moment()
      //   .add(1, 'days')
      //   .format('YYYY-MM-DD'),
      form_id: '217435',
    };
    return this.moonclerkApiClient.getCustomers(options).pipe(
      map(customers =>
        customers.find(customer => customer.custom_id === user.id),
      ),
      tap(customer => this.updateUserAccountLevel(user, customer)),
    );
  };

  private updateUserAccountLevel(user: User, customer: any): void {
    if (
      user.accountLevel === userAccountLevelsArray[0] &&
      this.isPaidCustomer(customer)
    ) {
      this.userRepository.update(user.id, {
        accountLevel: userAccountLevelsArray[1],
      });
    }
  }

  private isPaidCustomer(customer: any): boolean {
    return (
      customer &&
      customer.subscription &&
      customer.subscription.status === 'active'
    );
  }
}

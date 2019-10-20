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
import moment = require('moment');
import { MoonclerkCustomer } from '../clients/moonclerk-customer.interface';

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
    private readonly userAccountRepository: Repository<UserAccount>,
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

  public getUserPaymentStatus = (user: User): Observable<MoonclerkCustomer> => {
    const existingProAccount = user.userAccounts.find(userAccount => userAccount.account.type === 'pro');

    return existingProAccount ? this.getExistingCustomer(existingProAccount) : this.getNewCustomer(user);
  };

  private getExistingCustomer(proAccount: UserAccount): Observable<MoonclerkCustomer> {
    return this.moonclerkApiClient.getCustomer(proAccount.account.moonclerkPlanId);
  }

  private getNewCustomer(user: User): Observable<MoonclerkCustomer> {
    // Get all users who have completed pro checkout out in the past 30 days
    const options = {
      checkout_from: moment()
        .subtract(30, 'days')
        .format('YYYY-MM-DD'),
      checkout_to: moment()
        .add(1, 'days')
        .format('YYYY-MM-DD'),
      form_id: '217435',
    };
    return this.moonclerkApiClient.getCustomers(options).pipe(
      map(customers => customers.find(customer => customer.custom_id === user.id)),
      tap(customer => this.updateUserAccountLevel(user, customer)),
    );
  }

  private updateUserAccountLevel(user: User, customer: MoonclerkCustomer): void {
    if (this.isPaidCustomer(customer)) {
      this.userAccountRepository.create({
        account: {
          maxUsers: 1,
          monthlyPaymentAmount: customer.checkout.amount_due,
          moonclerkPlanId: customer.id.toString(),
          type: 'pro',
        },
        role: 'owner',
        user: { id: user.id },
      });
    }
  }

  private isPaidCustomer(customer: MoonclerkCustomer): boolean {
    return (
      customer &&
      customer.subscription &&
      customer.subscription.status === 'active'
    );
  }
}

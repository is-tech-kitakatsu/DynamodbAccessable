import { ServiceBase } from '../dynamodb/services/serviceBase';
import { UserAccount as Entity } from '../entities/userAccount';
import { UserAccountCollection as Collection } from '../collections/userAccountCollection';
import { UserAccountRepository as Repository } from '../repositories/userAccountRepository';
import { DynamodbAccessable } from '../dynamodb/concerns/dynamodbAccessable';
import { Constructor } from '../dynamodb/concerns/Constructor';
import { dynamodbClient } from '../dynamodb/clients/dynamodb';

export class UserAccountService extends DynamodbAccessable(
  ServiceBase<Entity, Collection, Repository> as Constructor<
    ServiceBase<Entity, Collection, Repository>
  >,
) {
  constructor(repository: Repository = new Repository(dynamodbClient)) {
    super(repository);
  }
}

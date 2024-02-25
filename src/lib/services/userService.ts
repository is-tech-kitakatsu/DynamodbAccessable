import { ServiceBase } from '../dynamodb/services/serviceBase';
import { User as Entity } from '../entities/user';
import { UserCollection as Collection } from '../collections/userCollection';
import { UserRepository as Repository } from '../repositories/userRepository';
import { DynamodbAccessable } from '../dynamodb/concerns/dynamodbAccessable';
import { Constructor } from '../dynamodb/concerns/Constructor';
import { dynamodbClient } from '../dynamodb/clients/dynamodb';

export class UserService extends DynamodbAccessable(
  ServiceBase<Entity, Collection, Repository> as Constructor<
    ServiceBase<Entity, Collection, Repository>
  >,
) {
  constructor(repository: Repository = new Repository(dynamodbClient)) {
    super(repository);
  }
}

import * as AWS from 'aws-sdk';
import { RepositoryBase } from '../dynamodb/repositories/repositoryBase';
import { User as Entity } from '../entities/user';
import { UserCollection as Collection } from '../collections/userCollection';
import { USERS_TABLE_NAME } from '../../../lib/dynamoDB/usersTable';

export class UserRepository extends RepositoryBase<Entity, Collection> {
  protected tableName: string = USERS_TABLE_NAME;

  protected getEntity(
    item?: AWS.DynamoDB.DocumentClient.AttributeMap,
  ): Entity | undefined {
    if (item === undefined) {
      return undefined;
    }

    // ここはitemのプロパティの型とEntityのinterfaceの型が同じであることをチェックしたい
    return new Entity(
      item.id,
      item.name,
      item.age,
      item.status,
      item.createdAt,
      item.updatedAt,
    );
  }

  protected createCollection(): Collection {
    return new Collection();
  }
}

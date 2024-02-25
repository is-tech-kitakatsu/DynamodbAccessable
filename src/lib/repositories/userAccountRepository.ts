import * as AWS from 'aws-sdk';
import { RepositoryBase } from '../dynamodb/repositories/repositoryBase';
import { UserAccount as Entity } from '../entities/userAccount';
import { UserAccountCollection as Collection } from '../collections/userAccountCollection';
import { USER_ACCOUNTS_TABLE_NAME } from '../../../lib/dynamoDB/userAccountsTable';

export class UserAccountRepository extends RepositoryBase<Entity, Collection> {
  protected tableName: string = USER_ACCOUNTS_TABLE_NAME;

  protected getEntity(
    item?: AWS.DynamoDB.DocumentClient.AttributeMap,
  ): Entity | undefined {
    if (item === undefined) {
      return undefined;
    }

    // ここはitemのプロパティの型とEntityのinterfaceの型が同じであることをチェックしたい
    return new Entity(
      item.id,
      item.email,
      item.password,
      item.createdAt,
      item.updatedAt,
    );
  }

  protected createCollection(): Collection {
    return new Collection();
  }
}

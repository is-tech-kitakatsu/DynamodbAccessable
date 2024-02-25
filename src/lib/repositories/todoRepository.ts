import * as AWS from 'aws-sdk';
import { RepositoryBase } from '../dynamodb/repositories/repositoryBase';
import { Todo as Entity } from '../entities/todo';
import { TodoCollection as Collection } from '../collections/todoCollection';
import { TODOS_TABLE_NAME } from '../../../lib/dynamoDB/todosTable';

export class TodoRepository extends RepositoryBase<Entity, Collection> {
  protected tableName: string = TODOS_TABLE_NAME;

  protected getEntity(
    item?: AWS.DynamoDB.DocumentClient.AttributeMap,
  ): Entity | undefined {
    if (item === undefined) {
      return undefined;
    }

    // ここはitemのプロパティの型とEntityのinterfaceの型が同じであることをチェックしたい
    return new Entity(
      item.id,
      item.userId,
      item.status,
      item.title,
      item.describe,
      item.doneAt,
      item.createdAt,
      item.updatedAt,
    );
  }

  protected createCollection(): Collection {
    return new Collection();
  }
}

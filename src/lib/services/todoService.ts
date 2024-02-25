import { ServiceBase } from '../dynamodb/services/serviceBase';
import { Todo as Entity } from '../entities/todo';
import { TodoCollection as Collection } from '../collections/todoCollection';
import { TodoRepository as Repository } from '../repositories/todoRepository';
import { DynamodbAccessable } from '../dynamodb/concerns/dynamodbAccessable';
import { Constructor } from '../dynamodb/concerns/Constructor';
import { dynamodbClient } from '../dynamodb/clients/dynamodb';

// https://github.com/microsoft/TypeScript/issues/5843#issuecomment-290972055
export class TodoService extends DynamodbAccessable(
  ServiceBase<Entity, Collection, Repository> as Constructor<
    ServiceBase<Entity, Collection, Repository>
  >,
) {
  constructor(repository: Repository = new Repository(dynamodbClient)) {
    super(repository);
  }
}

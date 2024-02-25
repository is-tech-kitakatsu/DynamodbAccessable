import { CollectionBase } from '../dynamodb/collections/collectionBase';
import { Todo as Entity } from '../entities/todo';

export class TodoCollection extends CollectionBase<Entity> { }

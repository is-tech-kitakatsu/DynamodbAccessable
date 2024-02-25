import { CollectionBase } from '../dynamodb/collections/collectionBase';
import { User as Entity } from '../entities/user';

export class UserCollection extends CollectionBase<Entity> { }

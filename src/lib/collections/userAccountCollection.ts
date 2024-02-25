import { CollectionBase } from '../dynamodb/collections/collectionBase';
import { UserAccount as Entity } from '../entities/userAccount';

export class UserAccountCollection extends CollectionBase<Entity> { }

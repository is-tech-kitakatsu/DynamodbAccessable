import { EntityBase } from '../entities/entityBase';
import { CollectionBase } from '../collections/collectionBase';
import { RepositoryBase } from '../repositories/repositoryBase';
import {
  DeleteItemInputBase,
  GetItemInputBase,
  PutItemInputBase,
  QueryInputBase,
  ScanInputBase,
  UpdateItemInputBase,
} from '../conditions';

export abstract class ServiceBase<
  TEntity extends EntityBase,
  TCollection extends CollectionBase<TEntity>,
  TRepository extends RepositoryBase<TEntity, TCollection>,
> {
  public repository: TRepository;

  constructor(repository: TRepository) {
    this.repository = repository;
  }

  public async getAsync(
    condition: GetItemInputBase,
  ): Promise<TEntity | undefined> {
    return this.repository.getAsync(condition);
  }

  public async queryAsync(condition: QueryInputBase): Promise<TCollection> {
    return this.repository.queryAsync(condition);
  }

  public async scanAllAsync(condition: ScanInputBase): Promise<TCollection> {
    return this.repository.scanAllAsync(condition);
  }

  public async putAsync(
    condition: PutItemInputBase,
  ): Promise<AWS.DynamoDB.DocumentClient.PutItemOutput> {
    return this.repository.putAsync(condition);
  }

  public async updateAsync(
    condition: UpdateItemInputBase,
  ): Promise<AWS.DynamoDB.DocumentClient.UpdateItemOutput> {
    return this.repository.updateAsync(condition);
  }

  public async deleteAsync(
    condition: DeleteItemInputBase,
  ): Promise<AWS.DynamoDB.DocumentClient.DeleteItemOutput> {
    return this.repository.deleteAsync(condition);
  }
}

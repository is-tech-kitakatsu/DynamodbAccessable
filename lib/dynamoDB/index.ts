import { Construct } from 'constructs';
import { buildTodosTable } from './todosTable';
import { buildSequenceTable } from './sequenceTable';
import { buildUsersTable } from './usersTable';
import { buildUserAccountsTable } from './userAccountsTable';

export const dynamoTables = (scope: Construct) => {
  const sequenceTable = buildSequenceTable(scope);
  const todosTable = buildTodosTable(scope);
  const usersTable = buildUsersTable(scope);
  const userAccountsTable = buildUserAccountsTable(scope);

  return { 
    sequenceTable, 
    todosTable,
    usersTable,
    userAccountsTable,
   }
}
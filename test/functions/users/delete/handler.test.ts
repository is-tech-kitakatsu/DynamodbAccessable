jest.mock('src/lib/middleware/middy/middify.ts', () => ({
  middyfy: jest.fn((handler) => handler),
}));
import { handler } from 'src/functions/users/delete/handler';
import * as DeleteUserServiceModule from 'src/lib/services/useCases/deleteUserService';
import { STATUS_CODE } from 'src/lib/http/statusCode';

describe('handler', () => {
  const deleteUserService = new DeleteUserServiceModule.DeleteUserService()
  const spyOnDeleteUserService = jest.spyOn(DeleteUserServiceModule, 'DeleteUserService').mockImplementation(() => deleteUserService)
  const spyOnExecute = jest.spyOn(deleteUserService, 'execute').mockResolvedValue(undefined)
  
  afterEach(() => {
    spyOnDeleteUserService.mockReset();
    spyOnExecute.mockReset();
  });

  it('正常系', async () => {
    const event: any = { // eslint-disable-line @typescript-eslint/no-explicit-any
      pathParameters: {
        userId: 'id',
      }
    }
    const actual = await handler.handler(event)

    expect(spyOnExecute).toHaveBeenCalledWith({
      userId: 'id',
    })
    expect(actual).toEqual({
      statusCode: STATUS_CODE.NO_CONTENT,
      body: {
        data: {}
      }
    })
  })
})
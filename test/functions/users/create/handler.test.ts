jest.mock('src/lib/middleware/middy/middify.ts', () => ({
  middyfy: jest.fn((handler) => handler),
}));
import { handler } from 'src/functions/users/create/handler';
import * as RegistrationServiceModule from 'src/lib/services/useCases/registrationService';
import { STATUS_CODE } from 'src/lib/http/statusCode';
import { RegistrationService } from 'src/lib/services/useCases/registrationService';

describe('handler', () => {
  const registrationService = new RegistrationService()
  const spyOnRegistrationService = jest.spyOn(RegistrationServiceModule, 'RegistrationService').mockImplementation(() => registrationService)
  const spyOnExecute = jest.spyOn(registrationService, 'execute').mockResolvedValue(undefined)
  afterEach(() => {
    spyOnRegistrationService.mockReset();
    spyOnExecute.mockReset();
  });

  it('正常系', async () => {
    const event: any = { // eslint-disable-line @typescript-eslint/no-explicit-any
      body: {
        name: 'name',
        age: 20,
        email: 'test@example.com',
        password: 'password',
        passwordConfirmation: 'password',
      }
    }
    const actual = await handler.handler(event)

    expect(spyOnExecute).toHaveBeenCalledWith({
      name: 'name',
      age: 20,
      email: 'test@example.com',
      password: 'password',
      passwordConfirmation: 'password',
    })
    expect(actual).toEqual({
      statusCode: STATUS_CODE.OK,
      body: {}
    })
  })
})
import { DateTime } from "luxon"
import { UserAccount } from "src/lib/entities/userAccount"

describe('validate', () => {
  const userAccount = new UserAccount(
    "id",
    undefined as unknown as string,
    undefined as unknown as string,
    undefined as unknown as string,
    DateTime.now().toMillis(),
    DateTime.now().toMillis(),
  )

  it('バリデーションチェックをすること', () => {
    expect(userAccount.validate()).toEqual(false)
    expect(userAccount.errors).toEqual([
      {
        email: "入力してください"
      },
      {
        password: "入力してください"
      },
      {
        userId: "入力してください"
    },
  ])
  })
})
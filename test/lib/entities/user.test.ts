import { DateTime } from "luxon"
import { User, UserStatus } from "src/lib/entities/user"

describe('validate', () => {
  const user = new User(
    "id",
    undefined as unknown as string,
    -1,
    undefined as unknown as UserStatus,
    DateTime.now().toMillis(),
    DateTime.now().toMillis(),
  )

  it('バリデーションチェックをすること', () => {
    expect(user.validate()).toEqual(false)
    expect(user.errors).toEqual([
      {
        name: "入力してください"
      },
      {
        status: "入力してください"
      },
      {
      age: "年齢は0より大きい値で入力してください"
    },
  ])
  })
})
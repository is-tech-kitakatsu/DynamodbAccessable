import { DateTime } from "luxon"
import { Status, Todo } from "src/lib/entities/todo"

describe('validate', () => {
  const todo = new Todo(
    "id",
    "userId",
    undefined as unknown as Status,
    "titletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitlea",
    "describe",
    DateTime.now().toMillis(),
    DateTime.now().toMillis(),
    DateTime.now().toMillis(),
  )

  it('バリデーションチェックをすること', () => {
    expect(todo.validate()).toEqual(false)
    expect(todo.errors).toEqual([{
      title: "100文字以上は入力できません"
    },
    {
      status: "入力してください"
    }])
  })
})
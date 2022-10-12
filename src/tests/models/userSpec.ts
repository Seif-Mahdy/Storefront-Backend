import { User, UsersModel } from '../../models/users'

const userModel = new UsersModel()

const dummyUser: User = {
  first_name: 'john',
  last_name: 'doe',
  username: 'johndoe',
  password: 'Strong@123456',
}

let user: User
describe('Testing users Model', () => {
  it('should have a create method', () => {
    expect(userModel.create).toBeDefined()
  })
  it('create method should return the user object once created', async () => {
    user = await userModel.create(dummyUser)
    expect({
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
    }).toEqual({
      first_name: dummyUser.first_name,
      last_name: dummyUser.last_name,
      username: dummyUser.username,
    })
  })
  it('should have an index method', () => {
    expect(userModel.index).toBeDefined()
  })
  it('index method should return a list of users', async () => {
    const results = await userModel.index()
    expect(results).toContain(user)
  })
  it('should have a show method', () => {
    expect(userModel.create).toBeDefined()
  })
  it('show method should return a user if the given id exist', async () => {
    const existingUser = await userModel.show(Number(user.id))
    expect(existingUser).toEqual(user)
  })
  it("show method should throw an error if the given id doesn't exist", async () => {
    const existingUser = await userModel.show(5)
    expect(existingUser).toThrowError
  })
  it('should have a authenticate method', () => {
    expect(userModel.authenticate).toBeDefined()
  })
  it('authenticate method should return a user if the given username and password are valid', async () => {
    const existingUser = (await userModel.authenticate(
      dummyUser.username,
      dummyUser.password
    )) as User
    expect(existingUser).toEqual(user)
  })
  it("authenticate method should throw an error if the given username doesn't exist", async () => {
    const existingUser = await userModel.authenticate(
      dummyUser.username,
      dummyUser.password
    )
    expect(existingUser).toThrowError
  })
  it('should have a delete method', () => {
    expect(userModel.delete).toBeDefined()
  })
  afterAll(async () => {
    await userModel.delete(Number(user.id))
  })
})

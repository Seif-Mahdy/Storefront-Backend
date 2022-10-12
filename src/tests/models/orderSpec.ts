import { Order, OrderModel } from '../../models/orders'
import { User, UsersModel } from '../../models/users'

const orderModel = new OrderModel()
const userModel = new UsersModel()
let dummyOrder: Order
let dummyUser: User = {
  first_name: 'john',
  last_name: 'doe',
  username: 'johndoe',
  password: '123456',
}
let order: Order

describe('Testing orders Model', () => {
  beforeAll(async () => {
    dummyUser = await userModel.create(dummyUser)
    dummyOrder = { status: 'Active', user_id: Number(dummyUser.id) }
  })
  it('should have a create method', () => {
    expect(orderModel.create).toBeDefined()
  })
  it('create method should create an order and return it', async () => {
    order = await orderModel.create(dummyOrder)
    expect({ status: order.status, user_id: order.user_id }).toEqual({
      ...dummyOrder,
    })
  })
  it('should have a show method that gets the active order for the user', () => {
    expect(orderModel.show).toBeDefined()
  })
  it('create method should return an order if the user with the passed user id has an active order', async () => {
    const order = await orderModel.show(Number(dummyOrder.user_id))
    expect({ status: 'Active', user_id: order.user_id }).toEqual({
      ...dummyOrder,
    })
  })
  afterAll(async () => {
    await orderModel.delete(Number(order.id))
    await userModel.delete(Number(dummyUser.id))
  })
})

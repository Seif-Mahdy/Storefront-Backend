import { Order, OrderModel } from '../../models/orders'

const orderModel = new OrderModel()
const testOrder: Order = { status: 'Active', user_id: 1 }
let order: Order

describe('Testing orders Model', () => {
  it('should have a create method', () => {
    expect(orderModel.create).toBeDefined()
  })
  it('create method should create an order and return it', async () => {
    order = await orderModel.create(testOrder)
    expect({ status: order.status, user_id: order.user_id }).toEqual({
      ...testOrder,
    })
  })
  it('should have a show method that gets the active order for the user', () => {
    expect(orderModel.show).toBeDefined()
  })
  it('create method should return an order if the user with the passed user id has an active order', async () => {
    const order = await orderModel.show(Number(testOrder.user_id))
    expect({ status: 'Active', user_id: order.user_id }).toEqual({
      ...testOrder,
    })
  })
  afterAll(async () => {
    await orderModel.delete(Number(order.id))
  })
})

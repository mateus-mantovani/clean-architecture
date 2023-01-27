import { sequelize, app } from '../express'
import request from 'supertest'

describe('E2E test for product', () => {
  beforeEach(async () => {
    await sequelize.sync({
      force: true
    })
  })

  afterAll(async () => {
    await sequelize.close()
  })

  it('should create a product', async () => {
    const response = await request(app)
      .post('/product')
      .send({
        name: 'Product XPTO',
        price: 299
      })

    expect(response.status).toBe(201)
    expect(response.body.name).toBe('Product XPTO')
    expect(response.body.price).toBe(299)
  })

  it('should not create a product', async () => {
    const response = await request(app)
      .post('/product')
      .send({
        name: 'Product XPTO'
      })

    expect(response.status).toBe(500)
  })

  it('should list all products', async () => {
    await request(app)
      .post('/product')
      .send({
        name: 'Product XPTO 1',
        price: 566
      })

    await request(app)
      .post('/product')
      .send({
        name: 'Product XPTO 2',
        price: 600
      })

    const listResponse = await request(app)
      .get('/product')
      .send()

    expect(listResponse.status).toBe(200)
    expect(listResponse.body.products.length).toBe(2)
    const product1 = listResponse.body.products[0]
    expect(product1.name).toBe('Product XPTO 1')
    expect(product1.price).toBe(566)

    const product2 = listResponse.body.products[1]
    expect(product2.name).toBe('Product XPTO 2')
    expect(product2.price).toBe(600)
  })
})

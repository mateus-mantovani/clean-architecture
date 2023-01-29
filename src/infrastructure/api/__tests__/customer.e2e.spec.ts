import { sequelize, app } from '../express'
import request from 'supertest'

describe('E2E test for customer', () => {
  beforeEach(async () => {
    await sequelize.sync({
      force: true
    })
  })

  afterAll(async () => {
    await sequelize.close()
  })

  it('should create a customer', async () => {
    const response = await request(app)
      .post('/customer')
      .send({
        name: 'John',
        address: {
          street: 'street',
          city: 'city',
          number: 123,
          zip: 'zipcode'
        }
      })

    expect(response.status).toBe(201)
    expect(response.body.name).toBe('John')
    expect(response.body.address.street).toBe('street')
    expect(response.body.address.city).toBe('city')
    expect(response.body.address.number).toBe(123)
    expect(response.body.address.zip).toBe('zipcode')
  })

  it('should not create a customer', async () => {
    const response = await request(app)
      .post('/customer')
      .send({
        name: 'John'
      })

    expect(response.status).toBe(500)
  })

  it('should list all customers', async () => {
    await request(app)
      .post('/customer')
      .send({
        name: 'John',
        address: {
          street: 'street',
          city: 'city',
          number: 123,
          zip: 'zipcode'
        }
      })

    await request(app)
      .post('/customer')
      .send({
        name: 'Sarah',
        address: {
          street: 'street 2',
          city: 'city 2',
          number: 222,
          zip: 'zipcode 2'
        }
      })

    const listResponse = await request(app)
      .get('/customer')
      .send()

    expect(listResponse.status).toBe(200)
    expect(listResponse.body.customers.length).toBe(2)
    const customer1 = listResponse.body.customers[0]
    expect(customer1.name).toBe('John')
    expect(customer1.address.street).toBe('street')
    expect(customer1.address.city).toBe('city')

    const customer2 = listResponse.body.customers[1]
    expect(customer2.name).toBe('Sarah')
    expect(customer2.address.street).toBe('street 2')
    expect(customer2.address.city).toBe('city 2')
  })

  it('should list all customers in XML format', async () => {
    await request(app)
      .post('/customer')
      .send({
        name: 'John',
        address: {
          street: 'street',
          city: 'city',
          number: 123,
          zip: 'zipcode'
        }
      })

    await request(app)
      .post('/customer')
      .send({
        name: 'Sarah',
        address: {
          street: 'street 2',
          city: 'city 2',
          number: 222,
          zip: 'zipcode 2'
        }
      })

    const listResponseXML = await request(app)
      .get('/customer')
      .set('Accept', 'application/xml')
      .send()

    expect(listResponseXML.status).toBe(200)
    expect(listResponseXML.text).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(listResponseXML.text).toContain('<name>John</name>')
    expect(listResponseXML.text).toContain('<name>Sarah</name>')
    expect(listResponseXML.text).toContain('<street>street</street>')
    expect(listResponseXML.text).toContain('<street>street 2</street>')
  })
})

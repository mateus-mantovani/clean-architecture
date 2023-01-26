import ProductFactory from '../../../domain/product/factory/product.factory'
import UpdateProductUseCase from './update.product.usecase'

const product = ProductFactory.create('A', 'Product A', 122)

const input = {
  id: product.id,
  name: 'Product A UPDATE',
  price: 159
}

const MockRepository = () => {
  return {
    create: jest.fn(),
    findAll: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    update: jest.fn()
  }
}

describe('Unit test for product update use case', () => {
  it('should update a product', async () => {
    const productRepository = MockRepository()
    const productUpdateUseCase = new UpdateProductUseCase(productRepository)

    const output = await productUpdateUseCase.execute(input)

    expect(output).toEqual({
      id: product.id,
      name: 'Product A UPDATE',
      price: 159
    })
  })
})

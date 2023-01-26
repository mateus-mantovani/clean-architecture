import ProductRepositoryInterface from '../../../domain/product/repository/product-repository.interface'
import { InputCreateProductDto } from './create.product.dto'
import { CreateProductUseCase } from './create.product.usecase'

const MockRepository = (): ProductRepositoryInterface => {
  return {
    create: jest.fn().mockReturnValue(Promise),
    find: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn()
  }
}

describe('Unit test create product use case', () => {
  it('should create a product', async () => {
    const productRepository = MockRepository()
    const createProductUseCase = new CreateProductUseCase(productRepository)

    const input: InputCreateProductDto = {
      name: 'Product 1',
      price: 1223
    }

    const result = await createProductUseCase.execute(input)

    expect(result).toEqual({
      id: expect.any(String),
      name: input.name,
      price: input.price
    })
  })

  it('should throw error when create a product', async () => {
    const productRepository = MockRepository()
    const createProductUseCase = new CreateProductUseCase(productRepository)

    const input: InputCreateProductDto = {
      name: '',
      price: 1223
    }

    await expect(createProductUseCase.execute(input)).rejects.toThrowError('Product name is invalid')
  })
})

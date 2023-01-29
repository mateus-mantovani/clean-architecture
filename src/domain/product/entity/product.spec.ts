import Product from './product'
describe('Product unit test', () => {
  it('should throw an error if the product id is invalid', () => {
    expect(() => {
      // eslint-disable-next-line no-unused-vars
      const product = new Product('', 'product name', 10)
    }).toThrowError('product: Id is required')
  })

  it('should throw an error if the product name is invalid', () => {
    expect(() => {
      // eslint-disable-next-line no-unused-vars
      const product = new Product('123', '', 10)
    }).toThrowError('product: Name is required')
  })

  it('should throw an error if the product price is invalid', () => {
    expect(() => {
      // eslint-disable-next-line no-unused-vars
      const product = new Product('123', 'Product', -10)
    }).toThrowError('product: price must be a positive number')
  })

  it('should throw an error if the product id, name and price are invalid', () => {
    expect(() => {
      // eslint-disable-next-line no-unused-vars
      const product = new Product('', '', -10)
    }).toThrowError('product: Id is required,product: Name is required,product: price must be a positive number')
  })

  it('should change name', () => {
    const product = new Product('123', 'Product', 10)
    expect(product.name).toBe('Product')
    product.changeName('New Product')
    expect(product.name).toBe('New Product')
  })

  it('should throw error when change name to invalid', () => {
    const product = new Product('123', 'Product', 10)
    expect(() => {
      product.changeName('')
    }).toThrowError('product: Name is required')
  })

  it('should change price', () => {
    const product = new Product('123', 'Product', 10)
    expect(product.price).toBe(10)
    product.changePrice(20)
    expect(product.price).toBe(20)
  })

  it('should throw error when change price to invalid', () => {
    const product = new Product('123', 'Product', 10)
    expect(() => {
      product.changePrice(-10)
    }).toThrowError('product: price must be a positive number')
  })
})

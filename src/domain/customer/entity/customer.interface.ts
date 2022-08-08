import Address from './address'

export default interface CustomerInterface {
    get id(): string
    get name(): string
    get address(): Address
}

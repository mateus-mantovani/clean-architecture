import EventDispatcher from '../../@shared/event/event-dispatcher'
import CustomerAddressChangedEvent from './customer-address-changed.event'
import Action1WhenCustomerAddressChangedEventHandler from './handler/action1-when-customer-address-changed.handle'

describe('Customer address changed event', () => {
  it('should notify all event handlers', () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler = new Action1WhenCustomerAddressChangedEventHandler()

    eventDispatcher.register('CustomerAddressChangedEvent', eventHandler)

    const spyEventHandler = jest.spyOn(eventHandler, 'handle')

    expect(eventDispatcher.getEventHandlers.CustomerAddressChangedEvent).toBeDefined()
    expect(eventDispatcher.getEventHandlers.CustomerAddressChangedEvent.length).toBe(1)
    expect(eventDispatcher.getEventHandlers.CustomerAddressChangedEvent[0]).toMatchObject(eventHandler)

    const customerAddressChangedEvent = new CustomerAddressChangedEvent({
      id: 1,
      name: 'Customer 1',
      address: 'Rua 1'
    })

    eventDispatcher.notify(customerAddressChangedEvent)
    expect(spyEventHandler).toHaveBeenCalled()
  })
})

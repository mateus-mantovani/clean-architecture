import EventDispatcher from '../../@shared/event/event-dispatcher'
import CustomerCreatedEvent from './customer-created.event'
import Action1WhenCustomerIsCreatedEventHandler from './handler/action1-when-customer-is-created.handler'
import Action2WhenCustomerIsCreatedEventHandler from './handler/action2-when-customer-is-created.handler'

describe('Customer created event', () => {
  it('should notify all event handlers', () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler1 = new Action1WhenCustomerIsCreatedEventHandler()
    const eventHandler2 = new Action2WhenCustomerIsCreatedEventHandler()

    eventDispatcher.register('CustomerCreatedEvent', eventHandler1)
    eventDispatcher.register('CustomerCreatedEvent', eventHandler2)

    const spyEventHandler1 = jest.spyOn(eventHandler1, 'handle')
    const spyEventHandler2 = jest.spyOn(eventHandler2, 'handle')

    expect(eventDispatcher.getEventHandlers.CustomerCreatedEvent).toBeDefined()
    expect(eventDispatcher.getEventHandlers.CustomerCreatedEvent.length).toBe(2)
    expect(eventDispatcher.getEventHandlers.CustomerCreatedEvent[0]).toMatchObject(eventHandler1)
    expect(eventDispatcher.getEventHandlers.CustomerCreatedEvent[1]).toMatchObject(eventHandler2)

    const customerCreatedEvent = new CustomerCreatedEvent({
      name: 'Customer 1',
      email: 'xpto@email.com'
    })

    eventDispatcher.notify(customerCreatedEvent)
    expect(spyEventHandler1).toHaveBeenCalled()
    expect(spyEventHandler2).toHaveBeenCalled()
  })
})

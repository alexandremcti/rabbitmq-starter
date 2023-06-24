import {mock} from 'jest-mock-extended'
import { Connection } from 'amqplib'

import RabbitmqMessageBroker from '../rabbitmq-message-broker'

const connectionMock = mock<Connection>()
jest.mock('amqplib', () => {
    const originalModule = jest.requireActual('amqplib');

    return {
        __esModule: true,
        ...originalModule,
        connect: () => connectionMock,
    }
})


describe('Rabbitmq Message Broker', () => {

    it('Deve instanciar uma conexão com o rabbit', async () => {
        const connectionString = 'amqp://localhost:5672';
        const broker = new RabbitmqMessageBroker(connectionString);           
        await expect(broker.connect()).toBeTruthy()
    })
})
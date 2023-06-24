import {mock} from 'jest-mock-extended'
import { Channel, Connection } from 'amqplib'

import RabbitmqMessageBroker from '../rabbitmq-message-broker'
import { MessageParams } from 'message-broker';

const connectionString = 'amqp://localhost:5672';
const connectionMock = mock<Connection>();
const channelMock = mock<Channel>();
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
        const broker = new RabbitmqMessageBroker(connectionString);           
        await expect(broker.connect()).toBeTruthy()
    })

    it('should publish a message', async () => {
        const topic = 'any_topic';
        const message: MessageParams = {topic, message: 'any_message'};
        jest.spyOn(connectionMock, 'createChannel').mockResolvedValueOnce(channelMock);
        const broker = new RabbitmqMessageBroker(connectionString);
        await broker.connect()
        jest.spyOn(broker['channel'], 'assertExchange').mockResolvedValueOnce({exchange: topic });
        jest.spyOn(broker['channel'], 'publish').mockImplementationOnce(() => true)
        await expect(broker.publish(message)).toBeTruthy()
    })
})
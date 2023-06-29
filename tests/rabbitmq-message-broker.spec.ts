import * as http from 'http'
import request from 'supertest'
import { MessageParams } from 'message-broker';
import server from '../server'
import RabbitmqMessageBroker from '../rabbitmq-message-broker'
import { Handler } from 'handler';

let app: http.Server;
let broker: RabbitmqMessageBroker;

const eventHandlerMock: Handler = { 
    async handle(event: any): Promise<any> {
        console.log('evento processado --> ', event)
        return event
    }
}


describe('Rabbitmq Message Broker', () => {
    
    beforeAll(async () => {
        broker = new RabbitmqMessageBroker('amqp://admin:123456@localhost:5672');
        await broker.connect();
        app = server({
            broker
        })
        .listen(3333, () => console.log('server running'))
    })

    afterAll(async () => {
        app.close()
        await broker.close()
    })
    
    it('Deve publicar uma mensagem', async () => {
        const topic = 'any_topic';
        const event: MessageParams = {topic, message: 'any_message'};
        const spy = jest.spyOn(RabbitmqMessageBroker.prototype, 'publish');

        await request(app).post('/').send(event); 
        expect(spy).toBeCalled()
        expect(spy.mock.calls[0][0].message).toBe(event.message)
        expect(spy.mock.calls[0][0].topic).toBe(event.topic)
    });

    it('Deve se inscrever em um tópico', async () => {
        const topic = 'any_topic_2';
        const spy = jest.spyOn(broker['channel'], 'assertExchange');
        
        await broker.createTopic(topic);
        await broker.subscribe(topic, eventHandlerMock);

        expect(broker['consumers']).toEqual(expect.objectContaining({[topic]: eventHandlerMock}));
        expect(spy).toBeCalledWith(topic, 'fanout', {durable: true})
    });

    it('Deve consumir um evento', async () => {
        const topic = 'any_topic_3';
        await broker.createTopic(topic);
        const spy = jest.spyOn(eventHandlerMock, 'handle');
        await broker.subscribe(topic, eventHandlerMock);
        await broker.consume(topic)
        const event: MessageParams = {topic, message: 'any_message'};
        await request(app).post('/').send(event);
        Promise.resolve(() => {
            setTimeout( () => {}, 3000)
        })
        expect(spy).toBeCalledWith(event.message);
    },5000)
})
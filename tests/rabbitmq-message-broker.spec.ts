import * as http from 'http'
import request from 'supertest'
import { MessageParams } from 'message-broker';
import server from '../server'
import RabbitmqMessageBroker from '../rabbitmq-message-broker'

let app: http.Server;
let broker: RabbitmqMessageBroker
const topic = 'any_topic';


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
        const event: MessageParams = {topic, message: 'any_message'};
        const spy = jest.spyOn(RabbitmqMessageBroker.prototype, 'publish');

        await request(app).post('/').send(event); 
        expect(spy).toBeCalled()
        expect(spy.mock.calls[0][0].message).toBe(event.message)
        expect(spy.mock.calls[0][0].topic).toBe(event.topic)
    });
})
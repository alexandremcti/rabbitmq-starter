import express, { NextFunction, Request, Response, json } from 'express';
import RabbitmqMessageBroker from './rabbitmq-message-broker';
import { Handler } from 'handler';


const app = express();
app.use(json())

//Criando a instância do Broker
const broker = new RabbitmqMessageBroker('amqp://admin:123456@localhost:5672')

//Handler que irá receber o evento da queue e processar
const eventHandler: Handler = { 
    async handle(event: any): Promise<any> {
        console.log('evento processado --> ', event)
        return event
    }
}

//tópico em que as mensagens serão enviadas e de onde serão distribuídas para as queues
const topic = 'logs';


//Instancia processo de inicialização da conexão com o Rabbit e bind(assinatura) da queue no tópico
(async (topic) => {
    await broker.connect()
    await broker.subscribe(topic, eventHandler)
    await broker.consume(topic)
})(topic)

//Rota criada para receber mensagem externa e publicar mensagem no broker
app.post('/', async (request: Request, response: Response, next: NextFunction) => {
    await broker.publish({topic, message: request.body })
    response.json({result: 'ok'})
})

app.listen(3000, () => console.log('server running'))
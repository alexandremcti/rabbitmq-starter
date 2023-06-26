import RabbitmqMessageBroker from "./rabbitmq-message-broker"
import eventHandler from "./event-handler";

export interface MessageBrokerFactory {
    create();
} 

const RabbitMessageBrokerFactory: MessageBrokerFactory = {
    async create(): Promise<RabbitmqMessageBroker> {
        //tópico em que as mensagens serão enviadas e de onde serão distribuídas para as queues
        const topic = 'logs';
        //Criando a instância do Broker
        const broker = new RabbitmqMessageBroker('amqp://admin:123456@localhost:5672');
        //Instancia processo de inicialização da conexão com o Rabbit e bind(assinatura) da queue no tópico
        await broker.connect();
        await broker.subscribe(topic, eventHandler);
        broker.consume(topic);

        return broker;
    }
}

export default RabbitMessageBrokerFactory

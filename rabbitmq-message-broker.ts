import { MessageBroker, MessageParams } from "message-broker";
import {Channel, Connection, connect} from 'amqplib';
import { Handler } from "handler";

export default class RabbitmqMessageBroker implements MessageBroker {
    private connection: Connection;
    private channel: Channel;
    private consumers: {[key: string]: Handler } = {}

    constructor(private uri: string) {
    }
    
    async connect(): Promise<void> {
        console.log('criando a conexão')
        this.connection = await connect(this.uri);
        console.log('criando o canal')
        this.channel = await this.connection.createChannel(); 
    }
    
    async publish<t extends MessageParams>(event: t): Promise<void> {
        const {topic, message} = event;
        console.log('criando/buscando exchange')
        await this.channel.assertExchange(topic, 'fanout', {durable: true} );
        console.log('publicando evento')
        const result = this.channel.publish(topic, '', Buffer.from(this.parseToString(message)))
        console.log('retorno da publicação do evento --> ', result)
    }
    
    private parseToString(message: any): string {
        try {
            return JSON.stringify(message)
        } catch (error) {
            console.log(error)
            throw new Error('erro ao parsear message')
        }
    }

    async subscribe(topic: string, handler: Handler): Promise<void> {
        this.consumers[topic] = handler;
        await this.channel.assertQueue(topic, {durable: true});
        const queue = topic;
        await this.channel.bindQueue(queue, topic, '')
    }

    async consume(eventName: string): Promise<void> {
        const result = await this.channel.consume(eventName, async (value) => {
            const {content} = value;
            const event = content.toString();
            await this.consumers[eventName].handle(event);
            this.channel.ack(value);
        })
        console.log(`resultado do consumo ${result.consumerTag}`);
    }

    async close(): Promise<void> {
        await this.channel.close();
        console.log('channel closed');
        await this.connection.close();
        console.log('channel closed');
    }
}
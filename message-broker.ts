import { Handler } from "handler";

export type MessageParams = {
    topic: string;
    message: any;
}

export interface MessageBroker{
    publish<t extends MessageParams> (message: t): Promise<void>
    subscribe(topic: string, handler: Handler): Promise<void>
    consume<k>(eventName: string): Promise<any>
    createTopic(topic: string, options?: any): Promise<void>
}
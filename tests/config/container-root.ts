import { RabbitMQTestContainer } from "./rabbitmq-testcontainer";

export class ContainerRoot {
    private static instance?: ContainerRoot;
    private readonly rabbitmqContainer = new RabbitMQTestContainer();

    private constructor () {}

    static getInstance(): ContainerRoot {
        if(this.instance == null) this.instance = new ContainerRoot();
        return this.instance
    }

    async start(): Promise<void> {
        await this.rabbitmqContainer.run();
    }

    async stop(): Promise<void> {
        await this.rabbitmqContainer.stop();
    }

}
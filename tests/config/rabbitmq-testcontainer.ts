import path from 'path';
import {DockerComposeEnvironment, type StartedDockerComposeEnvironment  } from 'testcontainers'

export class RabbitMQTestContainer {
    private compose: StartedDockerComposeEnvironment;
    
    constructor() {}
    
    async run(): Promise<void>{
        try {
            const filePath = path.join(__dirname, 'containers');
            const filename = 'docker-compose.yml';
            const compose = new DockerComposeEnvironment(
                filePath,
                filename
            );
            this.compose = await compose.up(['rabbitmq'])
            console.log('container up')    
        } catch (error) {
            console.log('falha ao subir container: ', error) 
            throw new Error('Docker não subiu o container')               
        }
    }

    async stop(): Promise<void> {
        try {
            await this.getCompose().down()
        } catch (error) {
            console.log(error)
            throw new Error('Docker não parou o container')
            
        }
    }

    private getCompose(): StartedDockerComposeEnvironment {
        return this.compose as StartedDockerComposeEnvironment;
    }
}
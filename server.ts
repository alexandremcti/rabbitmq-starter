import express, { NextFunction, Request, Response, json } from 'express';
import { MessageBroker } from './message-broker';

type CreateAppProps = {
    broker: MessageBroker;
} 

const server = (props: CreateAppProps) => {
    const { broker} = props;
    const app = express();
    app.use(json());

    //Rota criada para receber mensagem externa e publicar mensagem no broker
    app.post('/', async (request: Request, response: Response, next: NextFunction) => {
        const {topic, message} = request.body;
        await broker.publish({topic, message })
        response.json({result: 'ok'})
    })

    return app
};


export default server;
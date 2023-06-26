import { Handler } from "handler"

//Handler que irá receber o evento da queue e processar
const eventHandler: Handler = { 
    async handle(event: any): Promise<any> {
        console.log('evento processado --> ', event)
        return event
    }
}

export default eventHandler
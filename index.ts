import server from "./server";
import RabbitMessageBrokerFactory from "./message-broker-factory";



(async () => {
    const broker = await RabbitMessageBrokerFactory.create();
    const app = server({
        broker
    });
    app.listen(3000, () => console.log('server running'))
})()
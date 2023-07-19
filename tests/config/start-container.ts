import { ContainerRoot } from "./container-root";

export default async (): Promise<void> => {
    console.log('Starting containers...');
    const containerRoot = ContainerRoot.getInstance();
    await containerRoot.start();
    console.log('Container started');
}
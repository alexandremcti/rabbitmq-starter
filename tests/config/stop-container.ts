import { ContainerRoot } from "./container-root"

export default async (): Promise<void> => {
    console.log('Stoping container')
    const containerRoot = ContainerRoot.getInstance();
    await containerRoot.stop()
    console.log('Container Stopped')
}
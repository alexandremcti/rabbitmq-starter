export interface Handler {
    handle(event: any): Promise<any>
}
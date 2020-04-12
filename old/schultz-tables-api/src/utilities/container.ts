export class Container {
    registry: { [x:string]: any } = {}

    register(name: string, instance: any) {
        this.registry[name] = instance
    }

    lookup<T>(name: string): T {
        return this.registry[name] as T
    }
}

const container = new Container()
export default container

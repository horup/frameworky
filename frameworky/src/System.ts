import { Frameworky } from "./Frameworky";
import { BaseEntity } from ".";

export interface SystemCommand
{
    deleteEntity?:{id:number};
    tick?:{dt:number}
}

export interface System<Entity extends BaseEntity>
{
    init(f:Frameworky<Entity>);
    executeCommand<T>(f:Frameworky<Entity>, command:SystemCommand);
}

/*
export abstract class System<Component, Command extends SystemCommand = SystemCommand>
{
    components:Map<number, Component> = new Map<number, Component>();

    setComponent(id:number, c:Component)
    {
        this.components[id] = c;
    }

    getComponent(id:number)
    {
        return this.components[id];
    }

    abstract process(f:Frameworky, command:Command);
}*/
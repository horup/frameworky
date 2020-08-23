import { Frameworky } from "./Frameworky";
import { BaseEntity, BaseCommand } from ".";

export interface System<Entity extends BaseEntity = BaseEntity, Command extends BaseCommand = BaseCommand>
{
    init(f:Frameworky<Entity,Command>);
    executeCommand(f:Frameworky<Entity,Command>, command:Command);
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
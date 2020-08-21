import { Frameworky } from "./Frameworky";

export interface SystemCommand
{
    deleteEntity?:{id:number};
    tick?:{dt:number}
}

export interface System
{
    init(f:Frameworky);
    executeCommand<T>(f:Frameworky, command:SystemCommand);
}
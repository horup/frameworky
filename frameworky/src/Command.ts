import { Entity, Camera } from "./Entity";

export interface Command
{
    setEntities?:SetEntitiesCommand;
    spreadEntities?:SpreadEntitiesCommand;
    interpolateEntity?:InterpolateEntityCommand;
}

export interface SetEntitiesCommand
{
    entities:{[id:number]:Entity};
}

export interface SpreadEntitiesCommand
{
    entities:{[id:number]:Entity};
}

export interface InterpolateEntityCommand
{
    id:number;
    from:Entity;
    to:Entity;
    start?:number;
    end:number;
}
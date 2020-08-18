import { Entity, Camera } from "./Entity";

export interface Command
{
    setEntities?:SetEntitiesCommand;
    spreadEntities?:SpreadEntitiesCommand;
}

export interface SetEntitiesCommand
{
    entities:{[id:number]:Entity};
}

export interface SpreadEntitiesCommand
{
    entities:{[id:number]:Entity};
}

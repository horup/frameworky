import { Entity } from "./Entity";

export interface Command
{
    setEntities?:SetEntitiesCommand;
}

export interface SetEntitiesCommand
{
    entities:{[id:number]:Entity};
}
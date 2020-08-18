
export interface Position
{
    x:number;
    y:number;
    z:number;
}

export class Entity
{
    position?:Position = {x:0, y:0, z:0};
    radius?:number = 0.5;
}

export type Entities = {[id:number]:Entity};
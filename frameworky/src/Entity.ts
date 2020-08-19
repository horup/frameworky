export interface Position
{
    x:number;
    y:number;
    z:number;
}

export interface Direction
{
    x:number;
    y:number;
    z:number;
}

export interface Velocity
{
    x:number;
    y:number;
    z:number;
}

export interface Entity
{
    /**Position, if any, of the entity */
    position?:Position;

    /**The pointing direction, if any, of the entity */
    direction?:Direction;

    /**The Velocity of the Entity, if any */
    velocity?:Velocity;

    /**Radius, if any, of the entity */
    radius?:number;

    /**Attached Camera, if any, of the entity */
    camera?:Camera;
}

export interface Camera
{
}

export type Entities = {[id:number]:Entity};
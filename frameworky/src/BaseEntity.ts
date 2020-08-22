import { Component, Circular } from ".";

export class BaseEntity
{
    id:number;
    constructor(id:number)
    {
        this.id = id;
    }

    readonly position = new Component<Position>(this);
    readonly circular = new Component<Circular>(this);
    readonly body = new Component<Body>(this);

    serialize()
    {
        
    }
}
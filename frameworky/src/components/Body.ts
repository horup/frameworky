import { Clonable } from "../Interfaces";

export enum BodyShape
{
    Sphere = 1
}

export class Body implements Clonable<Body>
{
    constructor(props:Partial<Body> = null)
    {
        if (props)
        {
            for (let k in props)
                this[k] = props[k];
        }
    }
    cloneFrom(source: Body) 
    {
        this.mass = source.mass;
        this.shape = source.shape;
        this.linearDamping = source.linearDamping;
        this.velocity.x = source.velocity.x;
        this.velocity.y = source.velocity.y;
        this.velocity.z = source.velocity.z;
        this.collisionResponse = source.collisionResponse;
    }
    mass:number = 1;
    shape:BodyShape = BodyShape.Sphere;
    linearDamping:number = 0.99;
    velocity:{x:number, y:number, z:number} = {x:0, y:0, z:0};
    collisionResponse = true;
}
export enum BodyShape
{
    Sphere = 1
}

export class Body
{
    constructor(props:Partial<Body> = null)
    {
        if (props)
        {
            for (let k in props)
                this[k] = props[k];
        }
    }
    mass:number = 1;
    shape:BodyShape = BodyShape.Sphere;
    linearDamping:number = 0.99;
    velocity:{x:number, y:number, z:number} = {x:0, y:0, z:0};
}
import { vec3 } from "gl-matrix";

export class Transform
{
    prevPosition:vec3 = [0,0,0];
    position:vec3 = [0,0,0];
    constructor(props:Partial<Transform>)
    {
        for (let k in props)
            this[k] = props[k];
    }
}
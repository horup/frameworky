import { vec3 } from "gl-matrix";
import { Clonable } from "../Interfaces";

export class Transform implements Clonable<Transform>
{
    prevPosition:vec3 = [0,0,0];
    position:vec3 = [0,0,0];
    constructor(props:Partial<Transform>)
    {
        for (let k in props)
            this[k] = props[k];
    }
    cloneFrom(source: Transform)
    {
        for (let i = 0; i < 3; i++)
        {
            this.position[i] = source.position[i];
            this.prevPosition[i] = source.prevPosition[i];
        }
    }
}
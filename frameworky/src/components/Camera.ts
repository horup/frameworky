import { Clonable } from "../Interfaces";

export class Camera implements Clonable<Camera>
{
    constructor(props:Partial<Camera>)
    {
        for (let k in props)
        {
            this[k] = props[k];
        }
    }
    
    isActive:boolean = true;  
        
    cloneFrom(source: Camera)
    {
        this.isActive = source.isActive;
    }
}
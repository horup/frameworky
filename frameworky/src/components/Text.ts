import { Clonable } from "../Interfaces";

export class Text implements Clonable<Text>
{
    text:string = "";

    constructor(props:Partial<Text>)
    {
        for (let k in props)
        {
            this[k] = props[k];
        }
    }
    
    cloneFrom(source: Text) {
        throw new Error("Method not implemented.");
    }
}
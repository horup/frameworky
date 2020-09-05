import { Clonable } from "../Interfaces";

export class PlayerController implements Clonable<PlayerController>
{
    constructor(props:Partial<PlayerController> = null)
    {
        if (props)
            for (let k in props)
                this[k] = props[k];
    }
    

    disableInterpolation:boolean = false;
    speed:number = 10;

    cloneFrom(source: PlayerController) {
        throw new Error("Method not implemented.");
    }
}
export class PlayerController
{
    constructor(props:Partial<PlayerController> = null)
    {
        if (props)
            for (let k in props)
                this[k] = props[k];
    }

    disableInterpolation:boolean = false;
    speed:number = 10;
}
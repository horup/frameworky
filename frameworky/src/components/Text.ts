export class Text
{
    text:string = "";

    constructor(props:Partial<Text>)
    {
        for (let k in props)
        {
            this[k] = props[k];
        }
    }
}
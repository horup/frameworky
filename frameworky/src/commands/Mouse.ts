export interface Mouse
{
    buttons:number;
    x:number;
    y:number;
}

export interface MouseDown extends Mouse
{
    button:number;
}

export interface MouseUp extends Mouse
{
    button:number;
}

export interface MouseMove extends Mouse
{
   
}


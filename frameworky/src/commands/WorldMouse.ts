import { Mouse } from ".";

export interface WorldMouse extends Mouse
{
    z:number;
}

export interface WorldMouseMove extends WorldMouse
{
}

export interface WorldMouseDown extends WorldMouse
{
    button:number;
}

export interface WorldMouseUp extends WorldMouse
{
    button:number;
}


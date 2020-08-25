import { FixedUpdate, Update, KeyDown, KeyUp, MouseMove, MouseDown, MouseUp, WorldMouseMove, WorldMouseUp, WorldMouseDown } from "./commands";
export interface BaseCommand
{
    fixedUpdate?:FixedUpdate
    update?:Update
    
    keyDown?:KeyDown
    keyUp?:KeyUp

    mouseMove?:MouseMove;
    mouseDown?:MouseDown;
    mouseUp?:MouseUp;

    worldMouseMove?:WorldMouseMove;
    worldMouseUp?:WorldMouseUp;
    worldMouseDown?:WorldMouseDown;
}
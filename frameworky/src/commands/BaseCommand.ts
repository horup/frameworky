import { FixedUpdate, Update, KeyDown, KeyUp, MouseMove, MouseDown, MouseUp, WorldMouseMove, WorldMouseUp, WorldMouseDown, BodyCommand } from ".";
import { BodyCollision } from "./Body";
import { EntityCreated, EntityDeleted } from "./Entity";
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
    body?:BodyCommand;


    bodyCollision?:BodyCollision;

    entityCreated?:EntityCreated;
    entityDeleted?:EntityDeleted;
}
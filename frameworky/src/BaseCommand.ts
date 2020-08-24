import { FixedUpdate, Update, KeyDown, KeyUp } from "./commands";
export interface BaseCommand
{
    fixedUpdate?:FixedUpdate
    update?:Update
    keyDown?:KeyDown
    keyUp?:KeyUp
}
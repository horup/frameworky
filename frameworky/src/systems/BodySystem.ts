import { System, SystemCommand } from "../System";
import { Frameworky } from "../Frameworky";

export interface Body
{
    px:number;
    py:number;
    x:number;
    y:number;
    vx:number;
    vy:number;
}

export type Bodies = {[id:number]:Body};

export interface BodySystemCommand extends SystemCommand
{
    setBody?:{id:number, body:Body};
    helloFromBodySystem?:{bodies:Bodies};
}

export class BodySystem implements System
{
    bodies:Bodies = {};
    
    init(f: Frameworky) {
    }

    executeCommand(f: Frameworky, command: BodySystemCommand) 
    {
        if (command.deleteEntity)
        {
            delete this.bodies[command.deleteEntity.id];
            console.log(this.bodies);
        }
        if (command.setBody)
        {
            this.bodies[command.setBody.id] = command.setBody.body;
            console.log(this.bodies);
        }
        if (command.tick)
        {
            for (let id in this.bodies)
            {
                this.bodies[id].px = this.bodies[id].x;
                this.bodies[id].py = this.bodies[id].y;
                this.bodies[id].x += this.bodies[id].vx;
                this.bodies[id].y += this.bodies[id].vy;
            }
            f.executeCommand<BodySystemCommand>({
                helloFromBodySystem:{
                    bodies:this.bodies
                }
            })
        }
    }
}
import { System, SystemCommand } from "../System";
import { Frameworky } from "../Frameworky";
import { BaseEntity } from "../BaseEntity";


export class BodySystem implements System<BaseEntity>
{
    init(f: Frameworky<BaseEntity>) {
    }

    executeCommand(f: Frameworky<BaseEntity>, command: any) 
    {
       /* if (command.deleteEntity)
        {
            delete this.bodies[command.deleteEntity.id];
        }
        if (command.setBody)
        {
            this.bodies[command.setBody.id] = command.setBody.body;
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
        }*/
    }
}
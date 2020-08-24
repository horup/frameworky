import { System } from "../System";
import { Frameworky } from "../Frameworky";
import { BaseEntity } from "../BaseEntity";
import { BaseCommand } from "../BaseCommand";


export class BodySystem implements System<BaseEntity, BaseCommand>
{
    init(f: Frameworky<BaseEntity>) {
    }

    executeCommand(f: Frameworky<BaseEntity>, command: BaseCommand) 
    {
        if (command.fixedUpdate)
        {
            
        }
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
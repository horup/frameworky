import { System } from "..";
import { Frameworky } from "../Frameworky";
import { BaseEntity } from "../BaseEntity";
import { BaseCommand } from "../BaseCommand";

export class PlayerSystem implements System
{
    init(f: Frameworky<BaseEntity, BaseCommand>) {
        
    }
    executeCommand(f: Frameworky<BaseEntity, BaseCommand>, command: BaseCommand) {
        if (command.update)
        {
            f.entityManager.forEach(e=>{
                const t = e.transform.get();
                const k = f.keys;
                if (e.body.has)
                {
                    const force = {x:0, y:0, z:0};
                    const multiply = 10;
                    force.y += k.w ? multiply : k.s ? -multiply : 0;
                    force.x += k.a ? -multiply : k.d ? multiply : 0;
                    // if have a body, use physics
                    f.executeCommand({
                        body:{
                            applyForce:{
                                id:e.id,
                                v:force
                            }
                        }
                    })
                }
                else
                {
                    const speed = 5.0 * command.update.deltaTime;
                    t.y += k.w ? speed : k.s ? -speed : 0;
                    t.x += k.a ? -speed : k.d ? speed : 0;
                }
            }, e=>e.transform.has && e.playerController.has);
        }
    }
    
}
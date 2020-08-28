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
                const p = e.playerController.get();
                if (e.body.has)
                {
                    const force = {x:0, y:0, z:0};
                    const multiply = p.speed != null ? p.speed : 50;
                    force.y += k.w ? 1 : k.s ? -1 : 0;
                    force.x += k.a ? -1 : k.d ? 1 : 0;
                    const l = Math.sqrt(force.x*force.x + force.y*force.y);
                    if (l>0)
                    {
                        force.x /= l;
                        force.y /= l;
                        force.x *= multiply;
                        force.y *= multiply;
                    }
                    f.executeCommand({
                        body:{
                            applyForce:{
                                id:e.id,
                                f:force
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
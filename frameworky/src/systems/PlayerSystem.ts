import { System } from "..";
import { Frameworky } from "../Frameworky";
import { BaseEntity } from "../BaseEntity";
import { BaseCommand } from "../BaseCommand";

export class PlayerSystem implements System
{
    init(f: Frameworky<BaseEntity, BaseCommand>) {
        
    }
    executeCommand(f: Frameworky<BaseEntity, BaseCommand>, command: BaseCommand) {
        if (command.tick)
        {
            f.entityManager.forEach(e=>{
                const t = e.transform.get();
                const k = f.keys;
                const speed = 0.5;
                t.y += k.w ? speed : k.s ? -speed : 0;
                t.x += k.a ? -speed : k.d ? speed : 0;
            }, e=>e.transform.has && e.playerController.has);
           
            
        }
    }
    
}
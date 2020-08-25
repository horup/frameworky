import { System } from "../System";
import { Frameworky } from "../Frameworky";
import { BaseEntity } from "../BaseEntity";
import { BaseCommand } from "../BaseCommand";
import {Engine, Bodies, Body, World} from 'matter-js';

export class BodySystem implements System<BaseEntity, BaseCommand>
{
    engine:Engine = Engine.create();
    bodies = new Map<number, Body>();
    init(f: Frameworky<BaseEntity>) {
        //console.log(this.engine.world.gravity.y);
        this.engine.world.gravity.y = 0;
    }

    executeCommand(f: Frameworky<BaseEntity>, command: BaseCommand) 
    {
        if (command.fixedUpdate)
        {
            // ensure bodies are syncronized to world
            f.entityManager.forEach(e=>{
                const m = e.transform.get();
                if (this.bodies.has(e.id) == false)
                {
                    const circle = Bodies.circle(m.x, m.y, 0.5);
                    this.bodies.set(e.id, circle);
                    World.add(this.engine.world, [circle]);
                }
                else
                {
                    this.bodies.get(e.id).position.x = m.x;
                    this.bodies.get(e.id).position.y = m.y;
                }
            }, e=>e.body.has && e.transform.has);
            Engine.update(this.engine);

            // ensure bodies a syncronized back to transform
            this.bodies.forEach((b,id)=>{
                const m = f.entityManager.get(id).transform.get();
                m.x = b.position.x;
                m.y = b.position.y;
            })
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
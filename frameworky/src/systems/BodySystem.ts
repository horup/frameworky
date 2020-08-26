import { System } from "../System";
import { Frameworky } from "../Frameworky";
import { BaseEntity } from "../BaseEntity";
import { BaseCommand } from "../BaseCommand";
//import {Engine, Bodies, Body, World} from 'matter-js';
import * as CANNON from 'cannon';


export class BodySystem implements System<BaseEntity, BaseCommand>
{
    world = new CANNON.World();
    bodies = new Map<number, CANNON.Body>();
    init(f: Frameworky<BaseEntity>) {
        this.world.gravity.set(0,0, -9.82);
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
                    const circle = new CANNON.Body({
                        mass: 5,
                        position: new CANNON.Vec3(m.x, m.y, m.z),
                        shape: new CANNON.Sphere(0.5)
                    })
                    this.world.addBody(circle);
                    this.bodies.set(e.id, circle);
                }
                else
                {
                    this.bodies.get(e.id).position.x = m.x;
                    this.bodies.get(e.id).position.y = m.y;
                    this.bodies.get(e.id).position.z = m.z;
                }
            }, e=>e.body.has && e.transform.has);
            
            this.world.step(command.fixedUpdate.tickRate);

            // ensure bodies a syncronized back to transform
            this.bodies.forEach((b,id)=>{
                const m = f.entityManager.get(id).transform.get();
                m.x = b.position.x;
                m.y = b.position.y;
                m.z = b.position.z;
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
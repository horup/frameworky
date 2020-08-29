import { System } from "../System";
import { Frameworky } from "../Frameworky";
import { BaseEntity } from "../BaseEntity";
import { BaseCommand } from "../BaseCommand";
//import {Engine, Bodies, Body, World} from 'matter-js';
import * as CANNON from 'cannon';
import { BodyShape } from "..";


export class BodySystem implements System<BaseEntity, BaseCommand>
{
    world = new CANNON.World();
    bodies = new Map<number, CANNON.Body>();
    init(f: Frameworky<BaseEntity>) {
        //this.world.gravity.set(0,0, -9.82);
    }

    executeCommand(f: Frameworky<BaseEntity>, command: BaseCommand) 
    {
        if (command.body)
        {
            if (command.body.applyForce)
            {
                const applyForce = command.body.applyForce;
                const e = f.entityManager.get(applyForce.id);
                if (e && e.body.has)
                {
                    const b = this.bodies.get(e.id);
                    if (b)
                    {
                        const v = applyForce.f;
                        const p = new CANNON.Vec3(0,0,0);
                        b.applyForce(new CANNON.Vec3(v.x, v.y, v.z), CANNON.Vec3.ZERO);
                    }
                }
            }
        }
        if (command.fixedUpdate)
        {
            // ensure bodies are syncronized to world
            f.entityManager.forEach(e=>{
                const m = e.transform.get();
                const b = e.body.get();
                if (this.bodies.has(e.id) == false)
                {
                    const circle = new CANNON.Body({
                        mass: b.mass,
                        position: new CANNON.Vec3(m.x, m.y, m.z),
                        velocity: new CANNON.Vec3(b.velocity.x, b.velocity.y, b.velocity.z),
                        shape: b.shape == BodyShape.Sphere ? new CANNON.Sphere(0.5) : undefined,
                        linearDamping:b.linearDamping
                    })

                    circle.collisionResponse = true;

                    circle.addEventListener("collide", e=>{
                       // console.log(e);
                    })
                    this.world.addBody(circle);
                    this.bodies.set(e.id, circle);
                }
                else
                {
                    const body =  this.bodies.get(e.id);
                    //b.applyForce(new CANNON.Vec3(-100, 0,0),new CANNON.Vec3(0, 0,0));
                    body.position.set(m.x, m.y, m.z);
                    body.velocity.set(b.velocity.x, b.velocity.y, b.velocity.z);  
                }
            }, e=>e.body.has && e.transform.has);
            
            this.world.step(command.fixedUpdate.tickRate);

            // ensure bodies a syncronized back to transform and body component
            this.bodies.forEach((body,id)=>{
                const m = f.entityManager.get(id).transform.get();
                const b = f.entityManager.get(id).body.get();
                m.x = body.position.x;
                m.y = body.position.y;
                m.z = body.position.z;
                b.velocity.x = body.velocity.x;
                b.velocity.y = body.velocity.y;
                b.velocity.z = body.velocity.z;
                
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
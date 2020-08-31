import { System } from "../System";
import { Frameworky } from "../Frameworky";
import { BaseEntity } from "../BaseEntity";
import { BaseCommand } from "../commands/BaseCommand";
//import {Engine, Bodies, Body, World} from 'matter-js';
import * as CANNON from 'cannon';
import { BodyShape } from "..";


export class BodySystem implements System<BaseEntity, BaseCommand>
{
    world = new CANNON.World();
    bodies = new Map<number, CANNON.Body>();
    f:Frameworky<BaseEntity>;
    init(f: Frameworky<BaseEntity>) {
        this.f = f;
        //this.world.gravity.set(0,0, -9.82);
    }

    onCollide = (e:any)=>
    {
        const id = e.body.entityId;
        const targetId = e.target.entityId;
        this.f.executeCommand({
            bodyCollision:{
                id:id,
                targetId:targetId
            }
        })
    }

    executeCommand(f: Frameworky<BaseEntity>, command: BaseCommand) 
    {
        if (command.entityCreated)
        {

        }
        if (command.entityDeleted)
        {
            if (this.bodies.has(command.entityDeleted.id))
            {
                const b = this.bodies.get(command.entityDeleted.id);
                b.removeEventListener('collide', this.onCollide);
                this.world.remove(b);
                this.bodies.delete(command.entityDeleted.id);
            }
        }
        if (command.body)
        {
            if (command.body.applyForce)
            {
                const applyForce = command.body.applyForce;
                const e = f.getEntity(applyForce.id);
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
            f.forEachEntity(e=>{
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
                    });
                    (circle as any).entityId = e.id;

                    circle.collisionResponse = true;

                    circle.addEventListener("collide", this.onCollide);
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

            const deleted:number[] = [];
            // ensure bodies a syncronized back to transform and body component
            this.bodies.forEach((body,id)=>{
                //if (f.hasEntity(id))
               // {
                    const m = f.getEntity(id).transform.get();
                    const b = f.getEntity(id).body.get();
                    m.x = body.position.x;
                    m.y = body.position.y;
                    m.z = body.position.z;
                    b.velocity.x = body.velocity.x;
                    b.velocity.y = body.velocity.y;
                    b.velocity.z = body.velocity.z;
              /*  }
                else
                {
                    this.bodies.delete(id);
                }*/
                
            })
        }
    }
}
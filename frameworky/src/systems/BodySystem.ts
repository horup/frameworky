import { System } from "../System";
import { Frameworky } from "../Frameworky";
import { BaseEntity } from "../BaseEntity";
import { BaseCommand } from "../commands/BaseCommand";
//import {Engine, Bodies, Body, World} from 'matter-js';
import * as CANNON from 'cannon-es';
import { BodyShape } from "..";
import { CircleBufferGeometry } from "three";
import { vec3 } from "gl-matrix";


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

    raycast(from:vec3, to:vec3)
    {
        const results = new CANNON.RaycastResult();
        this.world.rayTest(
            new CANNON.Vec3(from[0], from[1], from[2]), 
            new CANNON.Vec3(to[0], to[1], to[2]),
            results);
        return {
            hasHit:results.hasHit,
            id:results.hasHit ? (results.body as any).entityId as number : null,
            hitPoint:results.hasHit ? vec3.fromValues(results.hitPointWorld.x, results.hitPointWorld.y, results.hitPointWorld.z) : null
        }
    }

    private toVec3(v:vec3)
    {
        return new CANNON.Vec3(v[0], v[1], v[2]);
    }

    applyForce(target:number, force:vec3, worldPoint:vec3)
    {
        const body = this.bodies.get(target);
        if (body != null)
        {
            body.applyForce(this.toVec3(force), this.toVec3(worldPoint));
        }
    }

    lastTime = 0;
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
                this.world.removeBody(b);
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
            const update = command.fixedUpdate;
            // store current position as previous
            f.forEachEntity(e=>{
                const t = e.transform.get();
                vec3.copy(t.prevPosition, t.position);
            }, e=>e.transform.has);

            // ensure bodies are syncronized to world
            f.forEachEntity(e=>{
                const m = e.transform.get();
                const b = e.body.get();
                if (this.bodies.has(e.id) == false)
                {
                    // create missing body.
                    const circle = new CANNON.Body({
                        mass: b.mass,
                        position: new CANNON.Vec3(m.position[0], m.position[1], m.position[2]),
                        velocity: new CANNON.Vec3(b.velocity.x, b.velocity.y, b.velocity.z),
                        shape: b.shape == BodyShape.Sphere ? new CANNON.Sphere(0.5) : undefined,
                        linearDamping:b.linearDamping
                    });
                    (circle as any).entityId = e.id;

                    circle.addEventListener("collide", this.onCollide);
                    this.world.addBody(circle);
                    this.bodies.set(e.id, circle);
                }
                
                const body =  this.bodies.get(e.id);
                body.collisionResponse = b.collisionResponse;
                body.position.set(m.position[0], m.position[1], m.position[2]);
                body.velocity.set(b.velocity.x, b.velocity.y, b.velocity.z);  
            }, e=>e.body.has && e.transform.has);
            
            this.world.step(update.deltaTime);
            //this.world.step(update.deltaTime, this.lastTime, 30);//, this.lastTime, 10);
            const deleted:number[] = [];
            // ensure bodies a syncronized back to transform and body component
            this.bodies.forEach((body,id)=>{
                    const t = f.getEntity(id).transform.get();
                    const b = f.getEntity(id).body.get();
                    t.position[0] = body.position.x;
                    t.position[1] = body.position.y;
                    t.position[2] = body.position.z;
                    b.velocity.x = body.velocity.x;
                    b.velocity.y = body.velocity.y;
                    b.velocity.z = body.velocity.z;
            })
        }
    }
}
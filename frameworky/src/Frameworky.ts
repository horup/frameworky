import * as THREE from 'three';
import { EventDispatcher } from 'three';
import { CameraEntity, Entity, SphericalEntity, SpatialEntity, BoxedEntity } from './Entity';
import { System, SystemCommand } from './System';
import { THREESystem } from './systems/THREESystem';
import { BodySystem } from './systems';

export class Frameworky
{
    private usedEntities:number[] = [];
    private freeEntities:number[] = [];
    private nextId = 1;
    private systems:System[] = [];
    private commandQueue:any[] = [];

    /**Initialized Frameworky, such that it is ready to run a game */
    initialize(onInitialized:()=>any):Frameworky
    {
        this.addDefaultSystems();
        onInitialized();
        return this;
    }

    addSystem(system:System)
    {
        this.systems.push(system);
        system.init(this);
    }

    addDefaultSystems():this
    {
        this.addSystem(new BodySystem());
        this.addSystem(new THREESystem());
        return this;
    }
/*
    allocateEntity():number
    {
        if (this.freeEntities.length > 0)
        {
            const id = this.freeEntities.pop();
            this.usedEntities.push(id);
            return id;
        }
        else
        {
            const id = this
        }
    }*/

    newId():number
    {
        return this.nextId++;
    }

    now()
    {
        return performance.now() / 1000;
    }
 /*  
    onKeyDown(f:(e:KeyboardEvent)=>any):this
    {
        document.addEventListener("keydown", f);
        return this;
    }

    onKeyUp(f:(e:KeyboardEvent)=>any):this
    {
        document.addEventListener("keyup", f);
        return this;
    }*/

    /*
    private update(dt:number)
    {
        const cmds = this.commandQueue;
        this.commandQueue = [];
        cmds.forEach((v)=>{
            this.executeCommand(v);
        })
    }*/

    executeCommand<T extends SystemCommand>(command:T):this 
    {
        this.systems.forEach(s=>s.executeCommand(this, command));
        return this;
    }

    enqueueCommand<T>(command:T):this
    {
        this.commandQueue.push(command);
        return this;
    }


}

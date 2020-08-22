import * as THREE from 'three';
import { EventDispatcher } from 'three';
import { System, SystemCommand } from './System';
import { THREESystem } from './systems/THREESystem';
import { BodySystem } from './systems';
import { BaseEntity } from './BaseEntity';
import { EntityManager } from './EntityManager';

export class Frameworky<Entity extends BaseEntity>
{
    private usedEntities:number[] = [];
    private freeEntities:number[] = [];
    private nextId = 1;
    private systems:System[] = [];
    private commandQueue:any[] = [];

    entityManager:EntityManager<Entity>;

    constructor(newEntity:new (id:number)=>Entity)
    {
        this.entityManager = new EntityManager<Entity>(newEntity);
    }

    /**Initialized Frameworky, such that it is ready to run a game */
    initialize(onInitialized:()=>any):Frameworky<Entity>
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

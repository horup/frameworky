import { System } from './System';
import { THREESystem } from './systems/THREESystem';
import { BaseEntity } from './BaseEntity';
import { EntityManager } from './EntityManager';
import {BaseCommand} from './BaseCommand';

export class Frameworky<Entity extends BaseEntity, Command extends BaseCommand = BaseCommand>
{
    private systems:System<Entity, Command>[] = [];
    private commandQueue:any[] = [];
    readonly entityManager:EntityManager<Entity>;

    constructor(newEntity:new (id:number)=>Entity)
    {
        this.entityManager = new EntityManager<Entity>(newEntity);
    }

    /**Initialized Frameworky, such that it is ready to run a game */
    initialize(onInitialized:()=>any):this
    {
        this.addDefaultSystems();
        onInitialized();
        return this;
    }

    addSystem(system:System<Entity, Command>)
    {
        console.log(this.systems);
        this.systems.push(system);
        system.init(this);
    }

    addDefaultSystems():this
    {
        //this.addSystem(new BodySystem());
        this.addSystem(new THREESystem());
        return this;
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

    executeCommand(command:Command):this 
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

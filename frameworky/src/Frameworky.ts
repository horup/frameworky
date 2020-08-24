import { System } from './System';
import { THREESystem } from './systems/THREESystem';
import { BaseEntity } from './BaseEntity';
import { EntityManager } from './EntityManager';
import {BaseCommand} from './BaseCommand';
import { PlayerSystem } from './systems/PlayerSystem';
import { BodySystem } from './systems';
import { Mouse } from './commands';

export class Frameworky<Entity extends BaseEntity, Command extends BaseCommand = BaseCommand>
{
    private systems:System<Entity, Command>[] = [];
    private commandQueue:any[] = [];
    readonly entityManager:EntityManager<Entity>;

    keys:{[key:string]:boolean} = {};
    mouse:Mouse = {x:0, y:0, buttons:0};

    constructor(newEntity:new (id:number)=>Entity, onReady:(f:Frameworky<Entity, Command>)=>void)
    {
        this.entityManager = new EntityManager<Entity>(newEntity);

        document.addEventListener("keydown", (e)=>{
            this.keys[e.key] = true;
            this.executeCommand({
                keyDown:{key:e.key}
            } as Command);
        });

        document.addEventListener("keyup", (e)=>{
            this.keys[e.key] = false;
            this.executeCommand({
                keyUp:{key:e.key}
            } as Command);
        })

        document.addEventListener("mousedown", (e)=>{
            e.preventDefault();
            this.mouse.buttons = e.buttons;
            this.mouse.x = e.x;
            this.mouse.y = e.y;
            e.buttons
            this.executeCommand({
                mouseDown:{
                    button:e.button, buttons:e.buttons,
                    x:e.x, y:e.y
                }
            } as Command);
        });

        document.addEventListener("mouseup", (e)=>{
            e.preventDefault();
            this.mouse.buttons = e.buttons;
            this.mouse.x = e.x;
            this.mouse.y = e.y;
            this.executeCommand({
                mouseUp:{
                    button:e.button, buttons:e.buttons,
                    x:e.x, y:e.y
                }
            } as Command);
        });

        document.addEventListener("mousemove", (e)=>{
            e.preventDefault();
            this.mouse.buttons = e.buttons;
            this.mouse.x = e.x;
            this.mouse.y = e.y;
            this.executeCommand({
                mouseMove:{
                    buttons:e.buttons,
                    x:e.x, y:e.y
                }
            } as Command);
        });

        document.oncontextmenu = ()=>false;

        onReady(this);
    }

    addSystem(system:System<Entity, Command>)
    {
        this.systems.push(system);
        system.init(this);
    }

    addDefaultSystems():this
    {
        this.addSystem(new THREESystem());
        this.addSystem(new PlayerSystem());
        this.addSystem(new BodySystem());

        return this;
    }

    now()
    {
        return performance.now() / 1000;
    }

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

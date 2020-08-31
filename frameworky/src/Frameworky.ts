import { System } from './System';
import { THREESystem } from './systems/THREESystem/THREESystem';
import { BaseEntity } from './BaseEntity';
import { EntityManager } from './EntityManager';
import {BaseCommand} from './commands/BaseCommand';
import { PlayerSystem } from './systems/PlayerSystem';
import { BodySystem } from './systems';
import { Mouse } from './commands';

export class Frameworky<Entity extends BaseEntity, Command extends BaseCommand = BaseCommand>
{
    readonly ticker = {count:0, time:0, rateMS:0 };

    private systems:System<Entity, Command>[] = [];
    private commandQueue:any[] = [];
    private functionQueue:((f:this)=>void)[] = [];
    readonly entityManager:EntityManager<Entity>;

    keys:{[key:string]:boolean} = {};
    mouse:Mouse = {x:0, y:0, buttons:0};

    constructor(newEntity:new (id:number)=>Entity, onReady:(f:Frameworky<Entity, Command>)=>void, tickRateMS:number = 50)
    {
        this.entityManager = new EntityManager<Entity>(newEntity);
        this.ticker.rateMS = tickRateMS;

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

        setInterval(()=>this.onTick(), this.ticker.rateMS);
        onReady(this);  
    }

    private onTick()
    {
        const now = this.now();
        const deltaTime = now - this.ticker.time;
        this.ticker.time = now;
        const fs = this.functionQueue;
        this.functionQueue = [];
        fs.forEach(func=>{
            func(this);
        });
        this.ticker.count++;
        const ticker = this.ticker;
        this.executeCommand({
            fixedUpdate:{
                time:ticker.time,
                tickRate:ticker.rateMS / 1000,
                deltaTime:deltaTime,
                count: ticker.count 
            }
        } as Command);
    }

    addSystem(system:System<Entity, Command>)
    {
        this.systems.push(system);
        system.init(this);
    }

    addDefaultSystems():this
    {
        this.addSystem(new PlayerSystem());
        this.addSystem(new BodySystem());
        this.addSystem(new THREESystem());

        return this;
    }

    now()
    {
        return performance.now() / 1000;
    }

    executeCommand(command:Command):this 
    {
        this.systems.forEach(s=>s.executeCommand(this, command));
        return this;
    }
/*
    enqueueCommand(command:Command):this
    {
        this.commandQueue.push(command);
        return this;
    }*/

    enqueueFunction(f:(f:this)=>void)
    {
        this.functionQueue.push(f);
    }
}

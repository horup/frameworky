import { System } from './System';
import { THREESystem } from './systems/THREESystem/THREESystem';
import { BaseEntity } from './BaseEntity';
import {BaseCommand} from './commands/BaseCommand';
import { PlayerSystem } from './systems/PlayerSystem';
import { BodySystem } from './systems';
import { Mouse } from './commands';
import * as Stats from 'stats.js';

export class Frameworky<E extends BaseEntity, Command extends BaseCommand = BaseCommand>
{
    readonly ticker = {count:0, time:0, rateMS:0 };

    private stats = new Stats();
    private constructEntity:new(id:number)=>E;
    private nextId = 0;
    private entities = new Map<number, E>(); 
    private systems:System<E, Command>[] = [];
    private commandQueue:Command[] = [];
    private functionQueue:((f:this)=>void)[] = [];
    frameskip = 1;

    keys:{[key:string]:boolean} = {};
    mouse:Mouse = {x:0, y:0, buttons:0};

    constructor(constructEntity:new (id:number)=>E, onReady:(f:Frameworky<E, Command>)=>void, tickRateMS:number = 50)
    {
        this.constructEntity = constructEntity;
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
        onReady(this);  
        this.initSystems();

        this.stats.showPanel(1);
        document.body.appendChild(this.stats.dom);

        requestAnimationFrame(this.onAnimationFrame);

    }

    private animationFrameTime = 0;
    private frames = 0;
    private onAnimationFrame = (time:number)=>
    {
        this.frames++;
        requestAnimationFrame(this.onAnimationFrame);

        if (this.frames % this.frameskip == 0)
        {
            this.stats.begin();
            time /= 1000;
            const deltaTime = time - this.animationFrameTime;

            if (this.ticker.time + this.ticker.rateMS / 1000 < time)
            {
                // fixed update
                const deltaTime = time - this.ticker.time;
                this.ticker.time = time;
                const cmds = this.commandQueue;
                this.commandQueue = [];
                cmds.forEach(c=>{
                    if (c.entityDeleted)
                        this.entities.delete(c.entityDeleted.id);
                    this.executeCommand(c);
                })
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

            const elapsed = (time - this.ticker.time);
            const elapsedFactor = elapsed / (this.ticker.rateMS / 1000);

            this.executeCommand({
                update:{
                    count:this.frames,
                    deltaTime:deltaTime,
                    elapsedSinceFixedUpdate:elapsed,
                    elapsedSinceFixedUpdateFactor:elapsedFactor,
                    time:time
                }
            } as Command);

        /*  this.executeCommand({
                update:{

                }
            })*/
            
            this.animationFrameTime = time;
            this.stats.end();
        }
    }

    private initSystems()
    {
        this.systems.forEach(s=>s.init(this));
    }

    private onTick()
    {
        
    }

    addSystem(system:System<E, Command>)
    {
        this.systems.push(system);
    }



    getSystem<T extends System<E, Command>>(constructor:new ()=>T):T
    {
        return this.systems.filter(s=>s.constructor.name == constructor.name)[0] as T;
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

    enqueueCommand(command:Command):this
    {
        this.commandQueue.push(command);
        return this;
    }

    enqueueFunction(f:(f:this)=>void)
    {
        this.functionQueue.push(f);
    }

  
    forEachEntity(f:(e:E)=>void, pred?:(e:E)=>boolean)
    {
        this.entities.forEach((e, id)=>{
            if (pred == null || pred(e))
                f(e);
        })
    }

    filterEntity(pred:(e:E)=>boolean):E[]
    {
        const arr:E[] = [];
        this.forEachEntity(e=>{
            arr.push(e);
        }, pred)
        return arr;
    }

    firstEntity(pred:(e:E)=>boolean):E
    {
        return this.filterEntity(pred)[0];
    }

    newEntity():E
    {
        const e = new this.constructEntity(this.nextId++);//new Entity(this.nextId++);
        this.entities.set(e.id, e);
        this.enqueueCommand({entityCreated:{id:e.id}} as Command);
        return e;
    }

    hasEntity(id:number)
    {
        return this.entities.has(id);
    }

    deleteEntity(id:number)
    {
        if (this.hasEntity(id))
        {
            this.enqueueCommand({entityDeleted:{id:id}} as Command);
        }
    }

    getEntity(id:number):E
    {
        return this.entities.get(id);
    }

    get size()
    {
        return this.entities.size;
    }
}

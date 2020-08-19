import * as THREE from 'three';
import { Command } from './Command';
import { State } from './State';
import { EventDispatcher } from 'three';
import { Camera, Entity } from './Entity';

export class Frameworky
{
    private commandQueue:Command[] = []
    private renderer:THREE.WebGLRenderer;
    private camera:THREE.Camera;
    private scene:THREE.Scene;
    private state:State;
    private meshes:{[id:number]:THREE.Mesh} = {};
    

    /**Initialized Frameworky, such that it is ready to run a game */
    initialize(onInitialized:()=>any):Frameworky
    {
        const s = document.getElementsByTagName("body")[0];
        s.style.margin = "0px";
        s.style.overflow = "hidden";
        this.renderer = new THREE.WebGLRenderer({antialias:true});
        document.body.appendChild(this.renderer.domElement);

        window.onresize = ()=>{
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }

        window.onresize(null);

        window.requestAnimationFrame(()=>this.onAnimationFrame());

        this.state = {entities:{}};

        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 100 );
        this.camera.position.z = 1;
        this.scene = new THREE.Scene();

        onInitialized();

        console.log(this.now());
        return this;
    }

    now()
    {
        return performance.now() / 1000;
    }

    private syncMeshes()
    {
        for (let entityId in this.state.entities)
        {
            const e = this.state.entities[entityId];
            if (this.meshes[entityId] == null)
            {
                const m = new THREE.Mesh(new THREE.SphereGeometry(1), new THREE.MeshNormalMaterial());
                this.meshes[entityId] = m;
                this.scene.add(m);
            }
            const m = this.meshes[entityId];
            if (e.radius)
            {
                const s = e.radius;
                m.scale.set(s, s, s);
            }
            if (e.position)
            {
                m.position.set(e.position.x, e.position.y, e.position.z);
            }
           
        }
    }

    private syncCamera()
    {
        const cam = Object.values(this.state.entities).filter(e=>e.camera != null)[0];
        if (cam)
        {
            this.camera.position.set(cam.position.x, cam.position.y, cam.position.z);
        }
    }

    dispatcher:EventDispatcher = new EventDispatcher(); 
    onBeginFrame(f:(framework:this)=>any):this
    {
        this.dispatcher.addEventListener("onBeginFrame", (e)=>f(this));
        return this;
    }

    onKeyDown(f:(e:KeyboardEvent)=>any):this
    {
        document.addEventListener("keydown", f);
        return this;
    }

    onKeyUp(f:(e:KeyboardEvent)=>any):this
    {
        document.addEventListener("keyup", f);
        return this;
    }

    private onAnimationFrame()
    {
        window.requestAnimationFrame(()=>this.onAnimationFrame());
        const cmds = this.commandQueue;
        this.commandQueue = [];
        cmds.forEach((v)=>this.executeCommand(v));
        
        this.dispatcher.dispatchEvent({type:"onBeginFrame"});
        this.syncMeshes();
        this.syncCamera();

        this.renderer.render(this.scene, this.camera);
    }

    foreachEntity(f:(id:number, entity:Entity)=>any, pred?:(e:Entity)=>boolean)
    {
        for (const id in this.state.entities)
        {
            const e = this.state.entities[id];
            if (pred == null || pred(e))
            {
                f(id as any, e);
            }
        }
    }

    firstEntity(pred:(e:Entity)=>boolean)
    {
        for (const id in this.state.entities)
        {
            const e = this.state.entities[id];
            if (pred(e))
            {
                return [parseInt(id), e] as const;
            }
        }

        return null;
    }

    executeCommand(command:Command):this
    {
        if (command.setEntities)
        {
            this.state.entities = {...command.setEntities.entities};
            console.log(this.state.entities);
        }
        else if (command.spreadEntities)
        {
            const es = command.spreadEntities.entities;
            for (const id in es)
            {
                const source = es[id];
                let target = this.state.entities[id];
                if (!target)
                {
                    target = {};
                    this.state.entities[id] = target;
                }

                for (let k in source)
                {
                    target[k] = {...target[k], ...source[k]};
                }
            }
        }
        else if (command.interpolateEntity)
        {
            const c = command.interpolateEntity;
            const now = this.now();
            const start = c.start;
            const end = c.end;
            const L = end - start;
            const D = end - now;
            let delta = 1 - D/L;
            delta = delta < 0 ? 0 : delta > 1 ? 1 : delta; 
            const e = this.state.entities[c.id];
            if (e)
            {
                if (start < now)
                {
                    if (e.position && c.from.position && c.to.position)
                    {
                        const x = c.to.position.x - c.from.position.x;
                        const y = c.to.position.y - c.from.position.y;
                        const z = c.to.position.z - c.from.position.z;

                        e.position.x = c.from.position.x + x * delta;
                        e.position.y = c.from.position.y + y * delta;
                        e.position.z = c.from.position.z + z* delta;
                    }
                }
                if (command.interpolateEntity.end > now)
                    this.enqueueCommand(command);
            }

        }

        return this;
    }

    enqueueCommand(command:Command):this
    {
        this.commandQueue.push(command);
        return this;
    }


}

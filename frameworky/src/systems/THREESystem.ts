import { System } from "../System";
import { Frameworky } from "../Frameworky";
import * as THREE from 'three';
import { BaseEntity } from "../BaseEntity";
import { Transform } from "../components";
import { BaseCommand } from '../BaseCommand';

export class THREESystem implements System<BaseEntity, BaseCommand>
{
    private renderer:THREE.WebGLRenderer;
    private camera:THREE.Camera;
    private scene:THREE.Scene;
    private meshes:{[id:number]:THREE.Mesh} = {};
    private f:Frameworky<BaseEntity, BaseCommand>;
    private tickrate = 500;
    init(f: Frameworky<BaseEntity, BaseCommand>) 
    {
        this.f = f;
        const s = document.getElementsByTagName("body")[0];
        s.style.margin = "0px";
        s.style.overflow = "hidden";
        this.renderer = new THREE.WebGLRenderer({antialias:true});
        document.body.appendChild(this.renderer.domElement);

        window.onresize = ()=>{
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }

        window.onresize(null);

        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 100 );
        this.camera.position.z = 10;
        this.scene = new THREE.Scene();

        window.requestAnimationFrame(()=>this.onAnimationFrame());
        setInterval(()=>this.onTick(), this.tickrate);
    }

    private prevPosition:{[id:number]:Transform} = {};

    executeCommand(f: Frameworky<BaseEntity, BaseCommand>, command:BaseCommand) 
    {
        if (command.tick)
        {
            console.log("three");
            f.entityManager.forEach(e=>{
                this.prevPosition[e.id] = {...e.transform.get()};
            }, e=>e.transform.has);
        }
       /* if (command.helloFromBodySystem)
        {
            this.bodies = command.helloFromBodySystem.bodies;
        }*/
    }

    private lastTick = performance.now();
    private onTick()
    {
        const now = performance.now();
        const dt = now - this.lastTick;
        this.f.executeCommand({
            tick:{
                dt:dt
            }
        })

        this.lastTick = performance.now();
    }

    private lastFrame = performance.now();

    private lastDiff = 0;
    private onAnimationFrame()
    {
        this.lastFrame = performance.now();
        window.requestAnimationFrame(()=>this.onAnimationFrame());
        const diff = (this.lastFrame - this.lastTick) / this.tickrate;
        
        this.f.entityManager.forEach(e=>{
            const transform = e.transform.get();
            if (this.meshes[e.id] == null)
            {
                this.meshes[e.id] = new THREE.Mesh(new THREE.SphereGeometry(0.5), new THREE.MeshNormalMaterial());
                this.scene.add(this.meshes[e.id]);
               
                //this.meshes[id].position.x = body.px + (body.x - body.px) * diff;
                //this.meshes[id].position.y = body.py + (body.y - body.py) * diff;
            }

            if (this.prevPosition[e.id] == null)
                this.prevPosition[e.id] = {...transform};

            this.meshes[e.id].position.x = this.prevPosition[e.id].x + (e.transform.get().x - this.prevPosition[e.id].x) * diff;
            this.meshes[e.id].position.y = this.prevPosition[e.id].y + (e.transform.get().y - this.prevPosition[e.id].y) * diff;
            this.meshes[e.id].position.z = this.prevPosition[e.id].z + (e.transform.get().z - this.prevPosition[e.id].z) * diff;

            if (e.camera.has && e.camera.get().isActive)
            {
                this.camera.position.x = this.meshes[e.id].position.x;//e.transform.get().x;
                this.camera.position.y = this.meshes[e.id].position.y;//e.transform.get().y;
                this.camera.position.z = this.meshes[e.id].position.z;e.transform.get().z;
            }

            if (diff < this.lastDiff)
            {
                //this.prevPosition[e.id].x = transform.x;
            }
        }, e=>e.transform.has);
      
        this.lastDiff = diff;

        this.renderer.render(this.scene, this.camera);
    }

}
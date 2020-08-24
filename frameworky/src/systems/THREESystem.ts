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
    private tickRateMS = 500;
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
        setInterval(()=>this.onTick(), this.tickRateMS);
    }

    private prevPosition:{[id:number]:Transform} = {};

    executeCommand(f: Frameworky<BaseEntity, BaseCommand>, command:BaseCommand) 
    {
        if (command.fixedUpdate)
        {
            f.entityManager.forEach(e=>{
                this.prevPosition[e.id] = {...e.transform.get()};
            }, e=>e.transform.has);
        }
       /* if (command.helloFromBodySystem)
        {
            this.bodies = command.helloFromBodySystem.bodies;
        }*/
    }

   // private lastTick = performance.now() / 1000;
    private fixedUpdateTime = 0;
    //private tickNow = 0;
    private count = 0;
    private onTick()
    {
        this.count++;
        this.f.executeCommand({
            fixedUpdate:{
                time:this.fixedUpdateTime,
                tickRate:this.tickRateMS / 1000,
                deltaTime:this.tickRateMS / 1000,
                count: this.count
            }
        });

        this.fixedUpdateTime += this.tickRateMS / 1000;
    }

    private lastFrame = performance.now() / 1000;
    private lastDiff = 0;
    private frames = 0;
    private onAnimationFrame()
    {
        this.frames++;
        const now = performance.now() / 1000;
        window.requestAnimationFrame((c)=>this.onAnimationFrame());
        const deltaTime = now - this.lastFrame;
        this.lastFrame = now;
        const elapsed = (this.lastFrame - this.fixedUpdateTime);
        const elapsedFactor = elapsed / (this.tickRateMS / 1000);

        this.f.executeCommand({
            update:{
                deltaTime:deltaTime,
                elapsedSinceFixedUpdate:elapsed,
                elapsedSinceFixedUpdateFactor:elapsedFactor,
                time:now,
                count:this.frames
            }
        })


        this.f.entityManager.forEach(e=>{
            const transform = e.transform.get();
            if (!e.camera.has)
            {
                if (this.meshes[e.id] == null)
                {
                    this.meshes[e.id] = new THREE.Mesh(new THREE.SphereGeometry(0.5), new THREE.MeshNormalMaterial());
                    this.scene.add(this.meshes[e.id]);
                }

                if (this.prevPosition[e.id] == null)
                    this.prevPosition[e.id] = {...transform};

                this.meshes[e.id].position.x = this.prevPosition[e.id].x + (e.transform.get().x - this.prevPosition[e.id].x) * elapsedFactor;
                this.meshes[e.id].position.y = this.prevPosition[e.id].y + (e.transform.get().y - this.prevPosition[e.id].y) * elapsedFactor;
                this.meshes[e.id].position.z = this.prevPosition[e.id].z + (e.transform.get().z - this.prevPosition[e.id].z) * elapsedFactor;
            }
            if (e.camera.has && e.camera.get().isActive)
            {
                this.camera.position.x = e.transform.get().x;
                this.camera.position.y = e.transform.get().y;
                this.camera.position.z = e.transform.get().z;
            }

            if (elapsedFactor < this.lastDiff)
            {
                //this.prevPosition[e.id].x = transform.x;
            }
        }, e=>e.transform.has);
      
        this.lastDiff = elapsedFactor;

        this.renderer.render(this.scene, this.camera);
    }

}
import { System } from "../System";
import { Frameworky } from "../Frameworky";
import * as THREE from 'three';
import { BaseEntity } from "../BaseEntity";
import { Transform } from "../components";
import { BaseCommand } from '../BaseCommand';
import { WorldMouse } from "../commands";
import { Vector3 } from "three";

export class THREESystem implements System<BaseEntity, BaseCommand>
{
    private renderer:THREE.WebGLRenderer;
    private camera:THREE.Camera;
    private scene:THREE.Scene;
    private planeZ = new THREE.Plane(new THREE.Vector3(0,0, 1), 0);
    private meshes:{[id:number]:THREE.Mesh} = {};
    private f:Frameworky<BaseEntity, BaseCommand>;
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
    }

    private position:{[id:number]:Transform}[] = [{}, {}];

    private screenMouse = new THREE.Vector2();
    private raycaster = new THREE.Raycaster();
    executeCommand(f: Frameworky<BaseEntity, BaseCommand>, command:BaseCommand) 
    {
       /* if (command.fixedUpdate)
        {
            const prevPosition = this.position[0];
            const nextPosition = this.position[1];
            f.entityManager.forEach(e=>{
                prevPosition[e.id] = nextPosition[e.id];
                nextPosition[e.id] = {...e.transform.get()};
            }, e=>e.transform.has);
        }
        else*/ if (command.mouseDown)
        {
            this.worldMouse.buttons = command.mouseDown.buttons;
            this.f.executeCommand({
                worldMouseDown:{
                    button:command.mouseDown.button,
                    buttons:this.worldMouse.buttons,
                    x:this.worldMouse.x,
                    y:this.worldMouse.y,
                    z:this.worldMouse.z
                }
            })
        }
        else if (command.mouseUp)
        {
            this.worldMouse.buttons = command.mouseUp.buttons;
            this.f.executeCommand({
                worldMouseUp:{
                    button:command.mouseUp.button,
                    buttons:this.worldMouse.buttons,
                    x:this.worldMouse.x,
                    y:this.worldMouse.y,
                    z:this.worldMouse.z
                }
            })
        }
     /*   else if (command.mouseMove)
        {
            const m = command.mouseMove;
            this.screenMouse.x = m.x / window.innerWidth * 2 - 1;
            this.screenMouse.y = -(m.y / window.innerHeight * 2 - 1);
            console.log(this.screenMouse);
            this.raycaster.setFromCamera(this.screenMouse, this.camera);
            let intersects = new THREE.Vector3();
            this.raycaster.ray.intersectPlane(this.planeZ, intersects);
            console.log(intersects);
        }*/
       /* if (command.helloFromBodySystem)
        {
            this.bodies = command.helloFromBodySystem.bodies;
        }*/
    }

    get width()
    {
        return window.innerWidth;
    }

    get height()
    {
        return window.innerHeight;
    }

    private worldMouse:WorldMouse = {x:0, y:0, z:0, buttons:0};
    private intersects = new THREE.Vector3();
    private updateWorldMouse()
    {
        this.screenMouse.x = this.f.mouse.x / this.width * 2 - 1;
        this.screenMouse.y = -(this.f.mouse.y / this.height * 2 - 1);
        this.raycaster.setFromCamera(this.screenMouse, this.camera);
        this.raycaster.ray.intersectPlane(this.planeZ, this.intersects);
        const v = this.intersects;
        if (this.worldMouse.x != v.x || this.worldMouse.y != v.y || this.worldMouse.z != v.z)
        {
            this.worldMouse.x = v.x;
            this.worldMouse.y = v.y;
            this.worldMouse.z = v.z;
            this.f.executeCommand({
                worldMouseMove:this.worldMouse
            })
        }
    }

   // private lastTick = performance.now() / 1000;
    //private tickNow = 0;
    private count = 0;
    

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
        const elapsed = (this.lastFrame - this.f.ticker.time);
        const elapsedFactor = elapsed / (this.f.ticker.rateMS / 1000);
        this.updateWorldMouse();
        this.f.executeCommand({
            update:{
                deltaTime:deltaTime,
                elapsedSinceFixedUpdate:elapsed,
                elapsedSinceFixedUpdateFactor:elapsedFactor,
                time:now,
                count:this.frames
            }
        }) 
  
        console.log(elapsed);   

        
        //console.log(elapsedFactor);


        this.f.entityManager.forEach(e=>{
            const transform = e.transform.get();
            if (!e.camera.has)
            {
                if (this.meshes[e.id] == null)
                {
                    this.meshes[e.id] = new THREE.Mesh(new THREE.SphereGeometry(0.5), new THREE.MeshNormalMaterial());
                    this.scene.add(this.meshes[e.id]);
                }

                const prevPosition = this.position[0];
                const nextPosition = this.position[1];
                if (prevPosition[e.id] == null)
                    prevPosition[e.id] = {...transform};
                if (nextPosition[e.id] == null)
                    nextPosition[e.id] = {...transform};

             /*   if (nextPosition[e.id].x != transform.x || nextPosition[e.id].y != transform.y || nextPosition[e.id].z != transform.z)
                {
                    prevPosition[e.id] = {...nextPosition[e.id]};
                    nextPosition[e.id] = {...transform};
                }*/

                this.meshes[e.id].position.x = nextPosition[e.id].x;
                this.meshes[e.id].position.y = nextPosition[e.id].y;
                this.meshes[e.id].position.z = nextPosition[e.id].z;
            /*    this.meshes[e.id].position.x = prevPosition[e.id].x + (nextPosition[e.id].x - prevPosition[e.id].x) * elapsedFactor;
                this.meshes[e.id].position.y = prevPosition[e.id].y + (nextPosition[e.id].y - prevPosition[e.id].y) * elapsedFactor;
                this.meshes[e.id].position.z = prevPosition[e.id].z + (nextPosition[e.id].z - prevPosition[e.id].z) * elapsedFactor;*/
             /*   if (this.position[e.id] == null)
                    this.position[e.id] = {...transform};

                this.meshes[e.id].position.x = this.position[e.id].x + (e.transform.get().x - this.position[e.id].x) * elapsedFactor;
                this.meshes[e.id].position.y = this.position[e.id].y + (e.transform.get().y - this.position[e.id].y) * elapsedFactor;
                this.meshes[e.id].position.z = this.position[e.id].z + (e.transform.get().z - this.position[e.id].z) * elapsedFactor;*/
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
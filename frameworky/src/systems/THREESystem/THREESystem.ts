import { System } from "../../System";
import { Frameworky } from "../../Frameworky";
import * as THREE from 'three';
import { BaseEntity } from "../../BaseEntity";
import { Transform } from "../../components";
import { BaseCommand } from '../../commands/BaseCommand';
import { WorldMouse } from "../../commands";
import { lerp3 } from "../../Math";

export class THREESystem implements System<BaseEntity, BaseCommand>
{
    debug = {
        renderBodies:true
    }

    private renderer:THREE.WebGLRenderer;
    private camera:THREE.Camera;
    private scene:THREE.Scene;
    private planeZ = new THREE.Plane(new THREE.Vector3(0,0, 1), 0);
    private meshes:{[id:number]:THREE.Mesh} = {};
    private f:Frameworky<BaseEntity, BaseCommand>;
    //private textsDiv:HTMLDivElement;
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
        if (command.mouseDown)
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
    private lastElapsedFactor = 0;
    private frames = 0;


    private worldToScreen(p:THREE.Vector3):THREE.Vector2
    {
        const projected = p.project(this.camera);
        const v2 = new THREE.Vector2(projected.x * this.width / 2 + this.width/2, projected.y * this.height/2 + this.height/2);
        v2.y = this.height - v2.y;
        return v2;
    }

    /*private updateTexts(elapsedFactor:number)
    {
        this.f.forEachEntity(e=>{
            let el = document.getElementById(e.id.toString());
            if (el == null)
            {
                el = document.createElement("div") as HTMLDivElement;
                document.body.appendChild(el);
                const s = el.style;
                s.position = 'absolute';
                s.userSelect = 'none';
            }

            const s = el.style;
            s.color = 'white';
            el.id = e.id.toString();
            
            const t = e.text.get().text;
            if (el.innerText != t)
                el.innerText = t;

            const p = e.transform.get();
            const v = this.worldToScreen(new THREE.Vector3(p.x, p.y, p.z));
            s.left = v.x + 'px';
            s.top = v.y + 'px';

            
        }, e=>e.text.has && e.transform.has);
    }*/

    private updateText(e:BaseEntity, x:number, y:number, z:number)
    {
        if (e.text.has)
        {
            let el = document.getElementById(e.id.toString());
            if (el == null)
            {
                el = document.createElement("div") as HTMLDivElement;
                document.body.appendChild(el);
                const s = el.style;
                s.position = 'absolute';
                s.userSelect = 'none';
            }

            const s = el.style;
            s.color = 'white';
            el.id = e.id.toString();
            
            const t = e.text.get().text;
            if (el.innerText != t)
                el.innerText = t;

            
            const v = this.worldToScreen(new THREE.Vector3(x, y, z));
            s.left = v.x + 'px';
            s.top = v.y + 'px';
        }
    }
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
        });

  
        this.f.forEachEntity(e=>{
            const transform = e.transform.get();
            const interpolate = !e.playerController.has || !e.playerController.get().disableInterpolation;
            if (this.meshes[e.id] == null)
            {
                this.meshes[e.id] = new THREE.Mesh(new THREE.SphereGeometry(0.5), new THREE.MeshNormalMaterial());
                this.meshes[e.id].position.x = transform.x;
                this.meshes[e.id].position.y = transform.y;
                this.meshes[e.id].position.z = transform.z;
                this.scene.add(this.meshes[e.id]);
            }

            if (interpolate)
            {
                const prevPosition = this.position[0];
                const nextPosition = this.position[1];
                if (prevPosition[e.id] == null)
                    prevPosition[e.id] = {...transform};
                if (nextPosition[e.id] == null)
                    nextPosition[e.id] = {...transform};

                if ((transform.x != nextPosition[e.id].x ||
                     transform.y != nextPosition[e.id].y ||
                     transform.z != nextPosition[e.id].z)|| 
                     elapsedFactor < this.lastElapsedFactor)
                {
                    prevPosition[e.id].x = this.meshes[e.id].position.x;
                    prevPosition[e.id].y = this.meshes[e.id].position.y;
                    prevPosition[e.id].z = this.meshes[e.id].position.z;

                    nextPosition[e.id].x = transform.x;
                    nextPosition[e.id].y = transform.y;
                    nextPosition[e.id].z = transform.z;
                }
            
                const x = prevPosition[e.id].x + (nextPosition[e.id].x - prevPosition[e.id].x) * elapsedFactor;
                const y = prevPosition[e.id].y + (nextPosition[e.id].y - prevPosition[e.id].y) * elapsedFactor;
                const z = prevPosition[e.id].z + (nextPosition[e.id].z - prevPosition[e.id].z) * elapsedFactor;

                this.meshes[e.id].position.x = x;
                this.meshes[e.id].position.y = y;
                this.meshes[e.id].position.z = z;

                this.updateText(e, x, y, z);
            }
            else
            {
                // not interpolated, simply set position
                this.meshes[e.id].position.x = transform.x;
                this.meshes[e.id].position.y = transform.y;
                this.meshes[e.id].position.z = transform.z;
                this.updateText(e, transform.x, transform.y, transform.z);
            }
            
            if (e.camera.has && e.camera.get().isActive)
            {
                this.camera.position.x = e.transform.get().x;
                this.camera.position.y = e.transform.get().y;
                this.camera.position.z = e.transform.get().z;
            }

            



            
        }, e=>e.transform.has);



        // cleanup of deleted entities
        for (let id in this.meshes)
        {
            if (this.f.hasEntity(parseInt(id))== false)
            {
                this.scene.remove(this.meshes[id]);
                delete this.meshes[id];
            }
        }
      
        this.lastElapsedFactor = elapsedFactor;

        this.renderer.render(this.scene, this.camera);
    }

}
import { System } from "../../System";
import { Frameworky } from "../../Frameworky";
import * as THREE from 'three';
import { BaseEntity } from "../../BaseEntity";
import { Transform } from "../../components";
import { BaseCommand } from '../../commands/BaseCommand';
import { WorldMouse, Update } from "../../commands";
import { lerp3 } from "../../Math";
import { vec3 } from "gl-matrix";
import * as Stats from 'stats.js';

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


        

        //window.requestAnimationFrame(()=>this.onAnimationFrame());
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
        else if (command.update)
        {
            this.onAnimationFrame(command.update);
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

    private updateText(e:BaseEntity, p:vec3)
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

            
            const v = this.worldToScreen(new THREE.Vector3(p[0],  p[1], p[2]));
            s.left = v.x + 'px';
            s.top = v.y + 'px';
        }
    }
    private onAnimationFrame(update:Update)
    {
        this.updateWorldMouse();
        const elapsedFactor = update.elapsedSinceFixedUpdateFactor;
        this.f.forEachEntity(e=>{
            const transform = e.transform.get();
            const interpolate = !e.playerController.has || !e.playerController.get().disableInterpolation;
            if (this.meshes[e.id] == null)
            {
                this.meshes[e.id] = new THREE.Mesh(new THREE.SphereGeometry(0.5), new THREE.MeshNormalMaterial());
                this.meshes[e.id].position.x = transform.position[0];
                this.meshes[e.id].position.y = transform.position[1];
                this.meshes[e.id].position.z = transform.position[2];
                this.scene.add(this.meshes[e.id]);
            }

            if (interpolate)
            {
                const p = lerp3(transform.prevPosition, transform.position, elapsedFactor);
                this.updateText(e, p);
                this.meshes[e.id].position.x = p[0];
                this.meshes[e.id].position.y = p[1];
                this.meshes[e.id].position.z = p[2];

            }
            else
            {
                // not interpolated, simply set position
                this.meshes[e.id].position.x = transform.position[0];
                this.meshes[e.id].position.y = transform.position[1];
                this.meshes[e.id].position.z = transform.position[2];
                this.updateText(e, transform.position);
            }
            
            if (e.camera.has && e.camera.get().isActive)
            {
                this.camera.position.x = e.transform.get().position[0];
                this.camera.position.y = e.transform.get().position[1];
                this.camera.position.z = e.transform.get().position[2];
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

        this.renderer.render(this.scene, this.camera);
    }

}
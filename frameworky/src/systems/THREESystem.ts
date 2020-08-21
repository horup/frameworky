import { System } from "../System";
import { Frameworky } from "../Frameworky";
import * as THREE from 'three';
import { BodySystemCommand, Bodies } from "./BodySystem";

export class THREESystem implements System
{
    private renderer:THREE.WebGLRenderer;
    private camera:THREE.Camera;
    private scene:THREE.Scene;
    private meshes:{[id:number]:THREE.Mesh} = {};
    private f:Frameworky;
    private tickrate = 500;
    init(f: Frameworky) 
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

    bodies:Bodies = {};

    executeCommand(f: Frameworky, command:BodySystemCommand) 
    {
        if (command.helloFromBodySystem)
        {
            this.bodies = command.helloFromBodySystem.bodies;
        }
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

    private onAnimationFrame()
    {
        this.lastFrame = performance.now();
        window.requestAnimationFrame(()=>this.onAnimationFrame());
        const diff = (this.lastFrame - this.lastTick) / this.tickrate;
        const bodies = this.bodies;
        for (let id in bodies)
        {
            const body = bodies[id];
            if (!this.meshes[id])
            {
                this.meshes[id] = new THREE.Mesh(new THREE.SphereGeometry(0.5), new THREE.MeshNormalMaterial());
                this.scene.add(this.meshes[id]);
            }
            this.meshes[id].position.x = body.px + (body.x - body.px) * diff;
            this.meshes[id].position.y = body.py + (body.y - body.py) * diff;
        }

        this.renderer.render(this.scene, this.camera);
    }

}
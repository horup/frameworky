import * as THREE from 'three';
import { Command } from './Command';
import { State } from './State';
import { EventDispatcher } from 'three';

export class Frameworky
{
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

        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
        this.camera.position.z = 1;
        this.scene = new THREE.Scene();

        onInitialized();

        return this;
    }

    private syncMeshes()
    {
        for (let entityId in this.state.entities)
        {
            const e = this.state.entities[entityId];
            if (this.meshes[entityId] == null)
            {
                console.log(e);
                const m = new THREE.Mesh(new THREE.SphereGeometry(1), new THREE.MeshNormalMaterial());
                this.meshes[entityId] = m;
                this.scene.add(m);
                console.log("added");
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

    dispatcher:EventDispatcher = new EventDispatcher(); 
    onBeginFrame(f:(framework:this)=>any)
    {
        this.dispatcher.addEventListener("onBeginFrame", (e)=>f(this));
    }

    private onAnimationFrame()
    {
        window.requestAnimationFrame(()=>this.onAnimationFrame());
        this.dispatcher.dispatchEvent({type:"onBeginFrame"});
        this.syncMeshes();

        this.renderer.render(this.scene, this.camera);
    }

    executeCommand(command:Command)
    {
        if (command.setEntities)
        {
            this.state.entities = {...command.setEntities.entities};
            console.log(this.state.entities);
        }
    }


}

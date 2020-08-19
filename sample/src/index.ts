import {Frameworky} from 'frameworky';
import { Entities } from 'frameworky/dist/Entity';

const f = new Frameworky();

f.initialize(()=>{
    console.log("Frameworky Initialized");

    const entities:Entities = {};
    let id = 0;
    entities[id++] = {
        position:
        {
            x:0,
            y:0,
            z:10
        },
        velocity:{
            x:0.1,
            y:0,
            z:0
        },
        camera:{},
        direction:{x:0, y:0, z:-1}
    }
    for (let y = 0; y < 5; y++)
    {
        for (let x = 0; x < 5; x++)
        {
            entities[id++] = {position:{x:x, y:y, z:0}, radius:0.5};
        }
    }

    f.enqueueCommand({
        setEntities:{
            entities:entities
        }
    })

}).onBeginFrame(f=>{
   /* f.executeCommand({
        setEntities:{
            entities:{
                0:{position:{x:Math.random()*2-1, y:0, z:0}, radius:Math.random()}
            }
        }
    })*/
}).onKeyDown(e=>{
    const [id, cam] = f.firstEntity(e=>e.camera != null);
    const speed = 0.5;
    //cam.position.x += speed;
  /*  const newX =  cam.position.x + speed;
    f.executeCommand({
        spreadEntities:{
            entities:{[id]:{position:{x:newX}}}
        }
    })*/

    f.enqueueCommand({
        interpolateEntity:{
            id:id,
            start:f.now(),
            end:f.now() + 1,
            from:{
                position:{x:0, y:0, z:10}
            },
            to:{
                position:{x:10, y:0, z:10}
            }
        }
    })

    f.enqueueCommand({
        interpolateEntity:{
            id:id,
            start:f.now()+1,
            end:f.now() + 2,
            from:{
                position:{x:10, y:0, z:10}
            },
            to:{
                position:{x:0, y:0, z:10}
            }
        }
    })
    
}).onKeyUp(e=>{
    console.log(e);
})

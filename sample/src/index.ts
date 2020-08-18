import {Frameworky} from 'frameworky';
import { Entities } from 'frameworky/dist/Entity';

const f = new Frameworky();

f.initialize(()=>{
    console.log("Frameworky Initialized");

    const entities:Entities = {};
    let id = 0;
    for (let y = 0; y < 5; y++)
    {
        for (let x = 0; x < 5; x++)
        {
            entities[id++] = {position:{x:x, y:y, z:0}, radius:0.5};
        }
    }

    f.executeCommand({
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
})

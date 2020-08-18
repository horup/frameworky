import {Frameworky} from 'frameworky';

const f = new Frameworky();

f.initialize(()=>{
    console.log("Frameworky Initialized");

    f.executeCommand({
        setEntities:{
            entities:{
                0:{position:{x:0, y:0, z:0}, radius:0.5}
            }
        }
    })
})

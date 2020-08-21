import {Frameworky, BodySystem, BodySystemCommand} from 'frameworky';
import { Entity, CameraEntity, SpatialEntity, SphericalEntity, BoxedEntity } from 'frameworky/dist/Entity';

const f = new Frameworky();
f.initialize(()=>{
    f.executeCommand<BodySystemCommand>({
        setBody:{
            id:0,
            body:{x:0,y:0,vx:0.1,vy:0}
        }
    })

    f.executeCommand<BodySystemCommand>({
        setBody:{
            id:1,
            body:{x:10,y:0,vx:-0.1,vy:0}
        }
    })

});
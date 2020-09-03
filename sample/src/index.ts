import {BaseEntity, BaseCommand, Component, Frameworky, System, Body, PlayerController, vec3, BodySystem, Text, Transform} from 'frameworky';
       
interface Health
{
    amount:number;
}

interface Command extends BaseCommand
{
    
}

class Entity extends BaseEntity
{
    health = new Component<Health>(this);
}

class TestSystem implements System<Entity, Command>
{
    init(f: Frameworky<Entity, Command>) {

    }

    executeCommand(f: Frameworky<Entity, Command>, command: Command) {
        if (command.worldMouseDown)
        {
            const cmd = command.worldMouseDown;
            const player = f.firstEntity(e=>e.playerController.has);
            const t = player.transform.get().position;
            let playerPosition = vec3.fromValues(t[0], t[1], t[2]);
            let worldPosition = vec3.fromValues(cmd.x, cmd.y, cmd.z);
            let v = vec3.create();
            vec3.sub(v, worldPosition, playerPosition);
            vec3.normalize(v, v);

            const bodySystem = f.getSystem(BodySystem);
            const res = bodySystem.raycast(playerPosition, worldPosition);
            
            if (res.hasHit)
            {
                const e = f.getEntity(res.id);
                if (e.health.has)
                {
                    vec3.scale(v, v, 100);
                    bodySystem.applyForce(e.id, v, playerPosition);
                    e.health.get().amount--;
                    if (e.health.get().amount <= 0)
                        f.deleteEntity(res.id);
                }
            }
        }
    }
   
}

new Frameworky<Entity>(Entity, (f)=>{
    f.addDefaultSystems();
    f.addSystem(new TestSystem());

    const camera = f.newEntity();
    camera.transform.attach(new Transform({
        position:[0,0,20]
    }));
    camera.camera.attach({
        isActive:true
    })

    const player = f.newEntity();
    player.text.attach(new Text({
        text:"Player!"
    }));
    player.transform.attach(new Transform({position:[-10, 0, 0]}));
    player.body.attach(new Body({linearDamping:0.99}));
    player.playerController.attach(new PlayerController());
    const max = 1000;
    const spread = 1;
    for (let i = 0; i < max; i++)
    {
        const spread = 1.1;
        const x = (i % Math.floor(Math.sqrt(max))) * spread;
        const y = (i / Math.floor(Math.sqrt(max))) * spread;
        const e = f.newEntity();
        e.transform.attach(new Transform({position:[x, y, 0]}));
        e.health.attach({
            amount:3
        })

        e.body.attach(new Body());
    }
}, 50);

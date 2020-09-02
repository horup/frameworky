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
           // vec3.add(v, playerPosition, v);
            

            const bodySystem = f.getSystem(BodySystem);
            const res = bodySystem.raycast(playerPosition, worldPosition);
            
            if (res.hasHit)
            {
                const e = f.getEntity(res.id);
                if (e.health.has)
                {
                    vec3.scale(v, v, 100);
                    bodySystem.applyForce(e.id, v, playerPosition);
                    console.log(v);
                    e.health.get().amount--;
                    if (e.health.get().amount <= 0)
                        f.deleteEntity(res.id);
                }
            }
            
           /* const ball = f.newEntity();
            ball.transform.attach({
                x:playerPosition[0] + v[0]*1.1,
                y:playerPosition[1] + v[1]*1.1,
                z:playerPosition[2] + v[2]*1.1
            });

            ball.body.attach(new Body({
                collisionResponse: false
            }));

            vec3.scale(v, v, 100);

            const v2 = ball.body.get().velocity;
            v2.x = v[0];
            v2.y = v[1];
            v2.z = v[2];*/
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
    const spread = 10;
    for (let i = 0; i < max; i++)
    {
        const e = f.newEntity();
        e.transform.attach(new Transform({position:[Math.random() * spread - spread/2 + 5, Math.random() * spread - spread/2, 0]}));
        e.health.attach({
            amount:3
        })

        e.body.attach(new Body());
    }
}, 50);

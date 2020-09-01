import {BaseEntity, BaseCommand, Component, Frameworky, System, Body, PlayerController, vec3, BodySystem} from 'frameworky';
       
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
        if (command.bodyCollision)
        {
            const col = command.bodyCollision;
          /*  f.deleteEntity(col.targetId);
            f.deleteEntity(col.id);*/
        }

        if (command.worldMouseDown)
        {
            const cmd = command.worldMouseDown;
            const player = f.firstEntity(e=>e.playerController.has);
            const t = player.transform.get();
            let playerPosition = vec3.fromValues(t.x, t.y, t.z);
            let worldPosition = vec3.fromValues(cmd.x, cmd.y, cmd.z);
            let v = vec3.create();
            vec3.sub(v, worldPosition, playerPosition);
            vec3.normalize(v, v);
            
            const ball = f.newEntity();
            ball.transform.attach({
                x:playerPosition[0] + v[0]*1.1,
                y:playerPosition[1] + v[1]*1.1,
                z:playerPosition[2] + v[2]*1.1
            });

            ball.body.attach(new Body({

            }));

            vec3.scale(v, v, 100);

            const v2 = ball.body.get().velocity;
            v2.x = v[0];
            v2.y = v[1];
            v2.z = v[2];
        }
    }
   
}

new Frameworky<Entity>(Entity, (f)=>{
    f.addDefaultSystems();
    f.addSystem(new TestSystem());
}, (f)=>{
    const camera = f.newEntity();
    camera.transform.attach({
        x:0, y:0, z:20
    });
    camera.camera.attach({
        isActive:true
    })

    const player = f.newEntity();
    player.transform.attach({x:-10, y:0, z:0});
    player.body.attach(new Body({linearDamping:0.99}));
    player.playerController.attach(new PlayerController());
    const spread = 10;
    for (let i = 0; i < 10; i++)
    {
        const e = f.newEntity();
        e.transform.attach({
            x:Math.random() * spread - spread/2 + 5,
            y:Math.random() * spread - spread/2,
            z:0
        });
        e.health.attach({
            amount:100
        })

        e.body.attach(new Body());
    }
}, 50);

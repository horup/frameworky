import {BaseEntity, BaseCommand, Component, Frameworky, System, Body, PlayerController} from 'frameworky';
       
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
      /*  if (command.fixedUpdate)
        {
            f.entityManager.forEach(e=>{
                e.transform.get().x-=0.1;
            }, e=>e.id == 1 && e.transform.has);
        }*/

        // enqueue a command that is executed during fixedUpdate
        if (command.worldMouseDown)
        {
           /* f.executeCommand({
                body:{
                    applyForce:{
                        v:{x:-1, y:0, z:0},
                        id:1 
                    }
                }
            })*/
        /*    f.enqueueFunction(f=>{
                const m = command.worldMouseDown;
                console.log(m);
                const first = f.entityManager.get(1);
                const t = first.transform.get();
                t.x = m.x;
                t.y = m.y;
            })*/
        }
    }
   
}

new Frameworky<Entity>(Entity, (f)=>{
    f.addDefaultSystems();
    f.addSystem(new TestSystem());

   /* const camera = f.entityManager.new();
    camera.transform.attach({
        x:0, y:0, z:20
    });
    camera.camera.attach({
        isActive:true
    })
    camera.playerController.attach({

    });*/

    const camera = f.entityManager.new();
    camera.transform.attach({
        x:0, y:0, z:20
    });
    camera.camera.attach({
        isActive:true
    })

    const player = f.entityManager.new();
    player.transform.attach({x:0, y:0, z:0});
    player.body.attach(new Body({linearDamping:0.99}));
    player.playerController.attach(new PlayerController());
    for (let i = 0; i < 100; i++)
    {
        const e = f.entityManager.new();
        e.transform.attach({
            x:1+ i % 16,
            y:-Math.floor(i / 16),
            z:0
        });
        e.health.attach({
            amount:100
        })

        e.body.attach(new Body());
    }
}, 50);

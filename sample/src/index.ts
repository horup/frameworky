import {BaseEntity, BaseCommand, Component, Frameworky, System} from 'frameworky';


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

        if (command.mouseDown)
        {
            const m = command.mouseDown;
            
        }
    }
   
}

new Frameworky<Entity>(Entity, (f)=>{
    f.addDefaultSystems();
    f.addSystem(new TestSystem());

    const camera = f.entityManager.new();
    camera.transform.attach({
        x:0, y:0, z:20
    });
    camera.camera.attach({
        isActive:true
    })
    camera.playerController.attach({

    });
    for (let i = 0; i < 100; i++)
    {
        const e = f.entityManager.new();
        e.transform.attach({
            x:i % 16,
            y:-Math.floor(i / 16),
            z:0
        });
        e.health.attach({
            amount:100
        })
    }
});

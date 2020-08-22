//import {Frameworky, BodySystem, BodySystemCommand, Entity} from 'frameworky';

import {EntityManager, BaseEntity, Component} from 'frameworky';

interface Health
{
    amount:number;
}

class Entity extends BaseEntity
{
    health = new Component<Health>(this);
}

let s = new EntityManager<Entity>(Entity);
let max = 1000000;
let now = performance.now();

for (let i = 0 ; i < max; i++)
{
    const e = s.new();
    e.position.attach({
        x:i,
        y:0
    });
    e.circular.attach({
        radius:0.5
    });
    e.health.attach({
        amount:100
    })
}

console.log("Creation of " + s.size + " took " + (performance.now() - now));
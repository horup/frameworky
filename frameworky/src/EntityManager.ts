import { BaseEntity } from "./BaseEntity";




export class EntityManager<E extends BaseEntity = BaseEntity>
{
    private newEntity:new(id:number)=>E;
    constructor(newEntity:new(id:number)=>E)
    {
        this.newEntity = newEntity;
    }

    private nextId = 0;
    private entities = new Map<number, E>(); 
    forEach(f:(e:E)=>void)
    {
        this.entities.forEach((e, id)=>{
            f(e);
        })
    }

    new():E
    {
        const e = new this.newEntity(this.nextId++);//new Entity(this.nextId++);
        this.entities.set(e.id, e);
        return e;
    }

    has(id:number)
    {
        return this.entities.has(id);
    }

    delete(id:number)
    {
        if (this.has(id))
            this.entities.delete(id);
    }

    get size()
    {
        return this.entities.size;
    }
}
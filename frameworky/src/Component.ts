import { BaseEntity } from ".";

export class Component<T, E = BaseEntity>
{
    constructor(entity:E)
    {
        this.entity = entity;
    }

    entity:E;
    component:T;
    get has()
    {
        return this.component != null;
    }
    get()
    {
        return this.component;
    }

    attach(component:T)
    {
        if (this.has)
            throw `attaching component ontop of component`
        this.component = component;
    }

    detach()
    {
        if (!this.has)
            throw `detaching non existing component`;
        this.component = null;
    }
}
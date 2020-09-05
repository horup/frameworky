import { BaseEntity } from ".";
import { Clonable } from "./Interfaces";
import { Transform } from "cannon-es";

export class Component<T extends Clonable<T>, E = BaseEntity> implements Clonable<Component<T, E>>
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

    cloneFrom(source: Component<T, E>) 
    {
        if (source.component != null)
        {
            if (this.component == null)
                this.component = new (source.component.constructor as any)({});
            this.component.cloneFrom(source.component);
        }
        else
        {
            this.component = null;
        }
        
    }
}
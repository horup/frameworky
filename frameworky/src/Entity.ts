
export interface IdentifiableEntity
{
    id:number;
}


export interface SpatialEntity extends IdentifiableEntity
{
    isSpatial:true;
    x:number;
    y:number;
    z:number;
    vx:number;
    vy:number;
    vz:number;
    dx:number;
    dy:number;
    dz:number;
}

export interface SphericalEntity extends SpatialEntity
{
    isSpherical:true;
    radius:number;
}

export interface BoxedEntity extends SpatialEntity
{
    isBoxed:true;
    w:number;
    h:number;
    d:number;
}

export interface CameraEntity extends SpatialEntity
{
    isCamera:true;
}

export type Entity = IdentifiableEntity & Partial<SpatialEntity> & Partial<SphericalEntity> & Partial<CameraEntity> & Partial<BoxedEntity>;
export type Entities = {[id:number]:Entity};
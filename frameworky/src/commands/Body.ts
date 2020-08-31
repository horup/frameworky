export interface BodyCommand
{
    applyForce?:{f:{x:number, y:number, z:number}, id:number};
}

export interface BodyCollision
{
    id:number;
    targetId:number;
}
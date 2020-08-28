export enum BodyShape
{
    Sphere = 1
}
export interface Body
{
    mass:number;
    shape:BodyShape,
    linearDamping:number
}
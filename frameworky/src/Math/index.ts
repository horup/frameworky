import { vec3 } from "gl-matrix";

export function lerp(start:number, end:number, amount:number)
{
    const delta = end - start;
    return start + delta * amount;
}

export function lerp3(start:vec3, end:vec3, amount:number):vec3
{
    return [
        start[0] + (end[0] - start[0]) * amount,
        start[1] + (end[1] - start[1]) * amount,
        start[2] + (end[2] - start[2]) * amount
    ]
}
import { Component, Transform, Body, Camera } from ".";
import { PlayerController } from "./components";

export class BaseEntity
{
    readonly id:number;
    constructor(id:number)
    {
        this.id = id;
    }

    readonly transform = new Component<Transform>(this);
    readonly body = new Component<Body>(this);
    readonly camera = new Component<Camera>(this);
    readonly playerController = new Component<PlayerController>(this);
}
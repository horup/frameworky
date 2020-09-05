import { Component, Transform, Body, Camera } from ".";
import { PlayerController, Text } from "./components";
import { Clonable } from "./Interfaces";

export class BaseEntity implements Clonable<BaseEntity>
{
    id:number;
    constructor(id:number)
    {
        this.id = id;
    }

    readonly transform = new Component<Transform>(this);
    readonly body = new Component<Body>(this);
    readonly camera = new Component<Camera>(this);
    readonly playerController = new Component<PlayerController>(this);
    readonly text = new Component<Text>(this);

    cloneFrom(source: BaseEntity) {
        this.id = source.id;
        this.transform.cloneFrom(source.transform);
        this.body.cloneFrom(source.body);
        this.camera.cloneFrom(source.camera);
        this.playerController.cloneFrom(source.playerController);
        this.text.cloneFrom(source.text);
    }
}
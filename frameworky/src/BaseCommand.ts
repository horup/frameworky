export interface BaseCommand
{
    fixedUpdate?:{
        count:number;
        time:number;
        deltaTime:number;
        tickRate:number;
    };

    update?:{
        count:number;
        time:number;
        deltaTime:number;
        elapsedSinceFixedUpdate:number;
        elapsedSinceFixedUpdateFactor:number;
    }

    keyDown?:{
        key:string;
    }

    keyUp?:{
        key:string;
    }
}
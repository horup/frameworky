export class Cell
{
    height:number = 0;
}

export class Grid
{
    width:number = 16;
    height:number = 16;
    cells:Cell[] = new Cell[this.height][this.width];
}
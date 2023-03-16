import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appGrid]',
})
export class GridDirective implements OnChanges{
  @Input() rows: number;
  @Input() cols: number;
  constructor(private el:ElementRef) {
    this.rows = 0;
    this.cols = 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
      if(changes['rows']){
        this.el.nativeElement.style.gridTemplateRows = `repeat(${this.rows} ,1fr)`
      }

      if(changes['cols']){
        this.el.nativeElement.style.gridTemplateColumns = `repeat(${this.cols} ,1fr)`
      }
  }
  
}

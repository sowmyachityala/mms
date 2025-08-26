import { Directive, Input, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appStarRating]'
})
export class StarRatingDirective implements OnInit {
  @Input('appStarRating') starRating: number;

  constructor(private el: ElementRef) { }

  ngOnInit() {
    this.el.nativeElement.style.position = 'relative';
    this.el.nativeElement.style.display = 'inline-block';
    this.el.nativeElement.style.unicodeBidi = 'bidi-override';
    this.el.nativeElement.style.textAlign = 'left';
    //this.el.nativeElement.innerHTML = '★★★★★';
    this.el.nativeElement.style.fontSize = '42px';
    const afterElement = document.createElement('div');
    afterElement.style.position = 'absolute';
    afterElement.style.top = '0';
    afterElement.style.left = '0';
    afterElement.style.whiteSpace = 'nowrap';
    afterElement.style.overflow = 'hidden';
    afterElement.style.width = (this.starRating * 20) + '%';
    afterElement.style.color = '#ff8c00';
    afterElement.innerHTML = '★★★★★';
    this.el.nativeElement.appendChild(afterElement);
  }
}

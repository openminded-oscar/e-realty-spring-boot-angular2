import {Component, Input} from '@angular/core';
import {RealtyObj} from '../../app-models/realty-obj';

@Component({
  selector: 'app-popularity-label',
  templateUrl: './popularity-label.component.html',
  styleUrl: './popularity-label.component.scss'
})
export class PopularityLabelComponent {
    @Input() realtyObject!: RealtyObj;
    @Input() count: number = 0;
    @Input() threshold: number = 5;

    // Returns true if the interest is considered popular
    get isPopular(): boolean {
        return this.realtyObject?.likesAmount > this.threshold;
    }
}

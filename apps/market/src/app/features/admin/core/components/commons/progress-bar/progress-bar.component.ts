import { CommonModule, DecimalPipe } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
  selector: "app-progress-bar",
  templateUrl: "./progress-bar.component.html",
  styleUrls: ["./progress-bar.component.scss"],
  imports: [CommonModule, DecimalPipe],
})
export class ProgressBarComponent {
  @Input() description: string = '';
  @Input() progress: number = 0;
  @Input() capacity: number = 0;
  @Input() maxCapacity: number = 100;

  get progressPercentage(): number {
    return (this.capacity / this.maxCapacity) * 100;
  }

  get tooltipContent(): string {
    const pipe = new DecimalPipe('en-US');
    return `Capacidad\n${pipe.transform(this.capacity, '0.0-3')} kg de ${pipe.transform(this.maxCapacity, '0.0-3')} kg`;
  }
}

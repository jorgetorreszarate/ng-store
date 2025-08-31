import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  input,
  signal
} from "@angular/core";

@Component({
  selector: "app-progress-circle",
  templateUrl: "./progress-circle.component.html",
  styleUrls: ["./progress-circle.component.scss"],
  standalone: true
})
export class ProgressCircleComponent implements OnChanges {
  readonly radius = input<number>(50);
  readonly value = input<number>(0);
  readonly stroke = input<number>(5);
  readonly color = input<string>("#00a6ff");
  readonly animation = input<boolean>(false);

  readonly circumference = signal<number>(0);

  readonly diameter = signal<number>(0);
  readonly dashoffset = signal<number>(0);
  readonly text = signal<string>('');

  interval: any;

  ngOnChanges(changes: SimpleChanges) {
    this.circumference.set(2 * Math.PI * this.radius());
    this.dashoffset.set(this.circumference());
    this.drawer();
  }

  drawer() {
    let percent = this.value();
    let deg = this.progress(percent);
    this.diameter.set(this.radius() * 2 + 20);


    if (this.animation()) {// Con animación
      let i = this.circumference(), p = 0;

      if (this.interval) clearInterval(this.interval);
      this.interval = setInterval(() => {
        this.dashoffset.set(i);
        p = Math.round(100 - (i / this.circumference()) * 100);

        this.text.set(`${p} %`);

        if (i <= deg) clearInterval(this.interval);
        i--;
      }, 1);
    } else {// Sin animación
      this.dashoffset.set(deg);
      this.text.set(`${this.value} %`);
    }
  }

  progress(value: number): number {
    let progress = value / 100;
    return this.circumference() * (1 - progress);
  }
}

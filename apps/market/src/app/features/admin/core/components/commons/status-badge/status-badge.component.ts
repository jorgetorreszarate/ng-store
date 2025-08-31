import {CommonModule} from "@angular/common";
import {Component, Input} from "@angular/core";

@Component({
  selector: "app-status-badge",
  templateUrl: "./status-badge.component.html",
  styleUrls: ["./status-badge.component.scss"],
  imports: [CommonModule],
})
export class StatusBadgeComponent {
  @Input() status!: number;
  @Input() type!: number; // 1: Venta | 2: Distribución

  getBadgeClass(): string {
    switch (this.status) {
      case 1:
        return this.type === 1 ? "bg-secondary" : "bg-warning";
      case 2:
        return this.type === 1 ? "bg-primary" : "bg-info";
      case 3:
        return this.type === 1 ? "bg-success" : "bg-success";
      case 4:
        return this.type === 1 ? "bg-danger" : "bg-primary";
      case 5:
        return this.type === 2 ? "bg-danger" : "";
      case 6:
        return this.type === 2 ? "bg-secondary" : "";
      default:
        return "";
    }
  }
}

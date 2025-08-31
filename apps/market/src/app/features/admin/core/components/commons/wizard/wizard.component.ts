import {CommonModule} from "@angular/common";
import {Component, ComponentRef, Injector, Input, ViewChild, ViewContainerRef} from "@angular/core";

@Component({
  selector: "app-wizard",
  templateUrl: "./wizard.component.html",
  styleUrls: ["./wizard.component.scss"],
  imports: [CommonModule],
})
export class WizardComponent {
  @Input() steps: {label: string; icon: string; component: any}[] = [];
  @Input() distributionData: any;
  @Input() formData: any;

  @ViewChild("stepContainer", {read: ViewContainerRef}) stepContainer: ViewContainerRef;

  currentStepIndex = 0;

  injectors: Injector[] = [];
  componentRef: ComponentRef<any>;

  ngOnInit() {
    this.injectors = this.steps.map(() => this.createInjector(this.distributionData));
  }

  ngAfterViewInit() {
    console.log("Initializing first step: ", this.currentStepIndex);
    this.loadStepData();
  }

  get currentStep() {
    return this.steps[this.currentStepIndex];
  }

  goToStep(index: number) {
    this.saveCurrentStepData();
    this.currentStepIndex = index;
    this.loadStepData();
  }

  nextStep() {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.saveCurrentStepData();
      this.currentStepIndex++;
      this.loadStepData();
    }
  }

  previousStep() {
    if (this.currentStepIndex > 0) {
      this.saveCurrentStepData();
      this.currentStepIndex--;
      this.loadStepData();
    }
  }

  private saveCurrentStepData() {
    const stepKey = this.getStepKey(this.currentStepIndex);
    if (this.componentRef && this.componentRef.instance.getFormData) {
      this.formData[stepKey] = this.componentRef.instance.getFormData();
    }
  }

  private loadStepData() {
    const stepKey = this.getStepKey(this.currentStepIndex);
    this.stepContainer.clear();

    const component = this.steps[this.currentStepIndex].component;
    this.componentRef = this.stepContainer.createComponent(component, {
      injector: this.injectors[this.currentStepIndex],
    });

    if (this.formData[stepKey]) {
      this.componentRef.instance.form.patchValue(this.formData[stepKey]);
    }
  }
  private getStepKey(index: number): string {
    switch (index) {
      case 0:
        return "planning";
      case 1:
        return "orders";
      case 2:
        return "assignment";
      default:
        return "";
    }
  }

  private createInjector(data: any): Injector {
    return Injector.create({
      providers: [{provide: "distributionData", useValue: data}],
    });
  }
}

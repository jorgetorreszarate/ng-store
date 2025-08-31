import { Component, DestroyRef, inject, OnInit, Self } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { PlaceService } from '@market-commons';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrl: './locations.component.scss',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    PlaceService
  ]
})
export class LocationsComponent implements OnInit, ControlValueAccessor {
  departaments: any[] = [];
  provinces: any[] = [];
  districts: any[] = [];

  form: FormGroup;

  onChange: (value: string) => void;
  onTouch: () => void;

  private readonly fb = inject(FormBuilder);
  private readonly placeService = inject(PlaceService);
  private readonly destroyRef = inject(DestroyRef);

  constructor(@Self() private ngControl: NgControl) {
    ngControl.valueAccessor = this;
    this.build();
  }

  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }

  ngOnInit(): void {
    this.getDepartaments();
    this.ubigeosChange();
  }

  build(): void {
    this.form = this.fb.group({
      IdDepartamento: null,
      IdProvincia: null,
      IdDistrito: null,
      IdUbigeo: null
    });

    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.updateValue());
  }

  updateValue(): void {
    // Para que actualice el formControl debe llamarse a onChange
    if (this.onChange) {
      const values = this.form.getRawValue();

      for (const k in values) {
        if (values[k] === 'null') {
          values[k] = null;
        }
      }

      this.onChange(values);
    }
  }

  writeValue(value: any): void {
    this.form.patchValue(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.form.disable() : this.form.enable();
  }

  async departamentChange(): Promise<void> {
    this.form.patchValue({ IdProvincia: null, IdDistrito: null, IdUbigeo: null });
  }

  async provinceChange(): Promise<void> {
    this.form.patchValue({ IdDistrito: null, IdUbigeo: null });
  }

  districtChange(): void {
    const distrito = this.districts.find(item => item.IdDistrito == this.form.get('IdDistrito').value);
    this.form.get('IdUbigeo').setValue(distrito?.IdUbigeo || null);
  }

  ubigeosChange(): void {
    this.form.get('IdDepartamento').valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.provinces = [];
        this.districts = [];
        this.getProvinces(value);
      });

    this.form.get('IdProvincia').valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.districts = [];
        this.getDistricts(value);
      });
  }

  async getDepartaments(): Promise<void> {
    const res = await lastValueFrom(this.placeService.departaments());
    this.departaments = res;
  }

  async getProvinces(departament_id: number): Promise<void> {
    if (+departament_id) {
      const res = await lastValueFrom(this.placeService.provinces(departament_id));
      this.provinces = res;
    }
  }

  async getDistricts(province_id: number): Promise<void> {
    if (+province_id) {
      const res = await lastValueFrom(this.placeService.districts(province_id));
      this.districts = res;
    }
  }
}

import { LocationsComponent } from '@admin-core/components/commons';
import { ConfirmService } from '@admin-core/services';
import { CustomValidators } from '@admin-core/validators';
import { Component, DestroyRef, ElementRef, OnInit, inject, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { CompanyService, OwnerService, PlaceService, SessionService } from '@market-commons';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    LocationsComponent
  ],
  providers: [
    PlaceService,
    CompanyService,
    OwnerService
  ]
})
export class CompanyComponent implements OnInit {
  form: FormGroup;
  showKeySunat: boolean;
  showKeyCert: boolean;

  logotipo: any;
  downloadInfo: number;

  isLoading: boolean;
  isLoadingDoc: boolean;
  isLoadingImage: boolean;

  readonly picture = viewChild<ElementRef>('picture');

  private readonly fb = inject(FormBuilder);
  private readonly session = inject(SessionService);
  private readonly sanitization = inject(DomSanitizer);
  private readonly confirmation = inject(ConfirmService);
  private readonly configurationService = inject(CompanyService);
  private readonly ownerService = inject(OwnerService);
  private readonly placeService = inject(PlaceService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.build();
  }

  build(): void {
    this.form = this.fb.group({
      IdEmpresa: null,
      IdTipoDocumento: [6, Validators.required],
      TipoDocumento: 'RUC',
      NroDocumento: [null, [Validators.required, CustomValidators.RUC]],
      RazonSocial: [null, Validators.required],
      NombreComercial: [null, Validators.required],
      IdDepartamento: [null, Validators.required],
      IdProvincia: [null, Validators.required],
      IdDistrito: [null, Validators.required],
      IdUbigeo: [null, Validators.required],
      Localizacion: null,
      Direccion: [null, Validators.required],
      CodSucursal: [null, Validators.pattern(/^[0-9]{4}$/)],
      DireccionSucursal: null,
      Email: [null, Validators.email],
      Telefono: null,
      FlagActivo: true,
      Logo: null, // Archivo logo      
      Detalle: null, // Frase
    });

    this.form.get('Localizacion').valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.form.patchValue(value);
      });
  }

  ngOnInit() {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.getCompany();
  }

  getCompany(): void {
    this.configurationService.get(this.session.user.companyId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.isLoading = false;
          this.logotipo = res.ImagenUrl;
          this.form.patchValue({
            ...res,
            Localizacion: {
              IdDepartamento: res.IdDepartamento,
              IdProvincia: res.IdProvincia,
              IdDistrito: res.IdDistrito,
              IdUbigeo: res.IdUbigeo
            },
          });
        },
        error: () => {
          this.isLoading = false;
        }
      });
  }

  searchDocument(): void {
    const values = this.form.value;
    this.isLoadingDoc = true;

    this.ownerService.getDataByDocument(values.IdTipoDocumento, values.NroDocumento)
      .pipe(
        finalize(() => this.isLoadingDoc = false),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: res => {
          this.form.patchValue({
            RazonSocial: res.RazonSocial,
            NombreComercial: res.RazonSocial,
            Direccion: res.Direccion,
          });

          this.getLocation(res.IdUbigeo);
        },
        error: err => {
          Swal.fire('Atención', err.error, 'error');
        }
      });
  }

  getLocation(ubigeo_id: string): any {
    return this.placeService.location(ubigeo_id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          const value = {
            IdDepartamento: res.IdDepartamento,
            IdProvincia: res.IdProvincia,
            IdDistrito: res.IdDistrito,
            IdUbigeo: ubigeo_id
          };

          this.form.get('Localizacion').setValue(value);
        }
      });
  }

  uploadPicture(): void {
    this.picture().nativeElement.click();
  }

  setFile(file: File): void {
    this.form.get('Logo').setValue(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = this.sanitization.bypassSecurityTrustUrl(e.target.result as string);
      this.logotipo = result;
    }

    reader.readAsDataURL(file);
  }

  changePicture(event: any): void {
    const file = event.target.files[0];
    this.setFile(file);
  }

  async deleteImage(): Promise<void> {
    const confirm = await this.confirmation.open('Eliminar', '¿Está seguro de eliminar el logo de la empresa?');

    if (!confirm) {
      return;
    }

    this.form.get('Logo').reset();
    this.logotipo = null;

    const company_doc = this.form.get('NroDocumento').value;
    if (company_doc) {
      this.isLoadingImage = true;

      this.configurationService.removeImagen(company_doc)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: res => {
            this.isLoadingImage = false;
            if (res) {
              Swal.fire('Listo', 'Se ha eliminado la imagen', 'success');
            }
          },
          error: () => {
            this.isLoadingImage = false;
          }
        });
    }
  }

  dragImage(event): void {
    event.preventDefault();
    event.stopPropagation();
  }

  dropImage(event): void {
    let dataTransfer = event.dataTransfer;
    if (dataTransfer?.files.length) {
      const file = dataTransfer.files[0];
      this.setFile(file);
    }

    event.preventDefault();
    event.stopPropagation();
  }

  save(): void {
    const values = this.form.getRawValue();
    this.isLoading = true;

    this.configurationService.register(values)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (company) => {
          this.isLoading = false;

          this.form.get('IdEmpresa').setValue(company.IdEmpresa);
          this.form.get('Logo').reset();

          Swal.fire('Guardado', 'Se han registrado los datos exitosamente', 'success');
        },
        error: () => {
          this.isLoading = false;
        }
      });
  }
}

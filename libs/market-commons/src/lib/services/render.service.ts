import { ComponentFactoryResolver, Injectable, Injector, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RenderComponentService {
	private readonly componentFactoryResolver = inject(ComponentFactoryResolver);
	private readonly injector = inject(Injector);

	create<T>(component: new (...args: any[]) => T, componentProps?: Partial<T>): string {
		const factory = this.componentFactoryResolver.resolveComponentFactory(component);
		const componentRef = factory.create(this.injector);

		if (componentProps) {
			this.applyProperties(componentRef.instance, componentProps);
		}

		componentRef.changeDetectorRef.detectChanges();

		// Obtenemos el html
		return componentRef.location.nativeElement.innerHTML;
	}

	private applyProperties<T>(instance: T, properties: Partial<T>): void {
		Object.assign(instance, properties);
	}

}

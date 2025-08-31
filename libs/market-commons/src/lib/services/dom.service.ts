import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
  Injectable,
  Injector,
  inject
} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DomService {
  private readonly componentFactoryResolver = inject(ComponentFactoryResolver);
  private readonly appRef = inject(ApplicationRef);
  private readonly injector = inject(Injector);

  // Creates and returns a component reference with optional properties applied
  createComponent<T>(component: new (...args: any[]) => T, componentProps?: Partial<T>): ComponentRef<T> {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    const componentRef = componentFactory.create(this.injector);

    if (componentProps) {
      this.applyProperties(componentRef.instance, componentProps);
    }

    return componentRef;
  }

  // Attaches the component to the provided parent in the DOM
  attachComponent<T>(componentRef: ComponentRef<T>, parent: Element): void {
    this.appRef.attachView(componentRef.hostView);
    const domElem = this.getComponentRootNode(componentRef);
    parent.appendChild(domElem);
  }

  // Detaches the component from the Angular component tree
  detachComponent<T>(componentRef: ComponentRef<T>): void {
    this.appRef.detachView(componentRef.hostView);
  }

  // Private method to apply properties to a component instance
  private applyProperties<T>(instance: T, properties: Partial<T>): void {
    Object.assign(instance, properties);
  }

  // Private method to extract the root DOM node from the component reference
  private getComponentRootNode<T>(componentRef: ComponentRef<T>): HTMLElement {
    return (componentRef.hostView as EmbeddedViewRef<T>).rootNodes[0] as HTMLElement;
  }
}

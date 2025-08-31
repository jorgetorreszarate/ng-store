import { DOCUMENT } from "@angular/common";
import { Injectable, effect, inject, signal } from "@angular/core";

enum SidebarStatus {
	open = 'open',
	close = 'close'
}

@Injectable({ providedIn: 'root' })
export class SidebarService {
	private DOCUMENT = inject(DOCUMENT);
	private KEY_STORAGE: string = 'sidebar';
	isOpen = signal<boolean>(false);

	constructor() {
		effect(() => {
			const CLASS_NAME = 'sb-open';
			this.isOpen() ?
				this.DOCUMENT.body.classList.add(CLASS_NAME) :
				this.DOCUMENT.body.classList.remove(CLASS_NAME);
		});
	}

	open(): void {
		this.setValue(true);
	}

	close(): void {
		this.setValue(false);
	}

	toggle(): void {
		this.setValue(!this.isOpen());
	}

	readInitialStatus(): void {
		const sidebar = localStorage.getItem(this.KEY_STORAGE);
		this.setValue(!sidebar || sidebar === SidebarStatus.open);
	}

	private setValue(value: boolean): void {
		this.isOpen.set(value);
		this.save();
	}

	private save(): void {
		localStorage.setItem(this.KEY_STORAGE, this.isOpen() ? SidebarStatus.open : SidebarStatus.close);

		// Trigger for resize apexcharts
		setTimeout(() => {
			window.dispatchEvent(new Event('resize'));
		}, 250);
	}
}
import { PaginatorComponent, PaginatorPipe } from '@admin-core/components/commons';
import { BsModalService } from '@admin-core/services';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PersonalService, YesnoPipe } from '@market-commons';

@Component({
  selector: 'app-modal-users',
  templateUrl: './modal-users.component.html',
  styleUrls: ['./modal-users.component.scss'],
  imports: [PaginatorComponent, YesnoPipe, PaginatorPipe],
  providers: [PersonalService]
})
export class ModalUsersComponent implements OnInit {
  keywords: FormControl;
  users: any[] = [];
  paginatorController: any = {};

  private readonly personalService = inject(PersonalService);
  private readonly bsModal = inject(BsModalService);

  constructor() {
    this.keywords = new FormControl('');
  }

  ngOnInit() {
    this.search();
  }

  search(): void {
    this.personalService.search(this.keywords.value).subscribe(res => {
      this.users = res;
    });
  }

  select(user: any): void {
    const p = {
      ...user,
      Personal: `${user.Nombres} ${user.ApePaterno} ${user.ApeMaterno}`
    }

    this.bsModal.close(p);
  }

}

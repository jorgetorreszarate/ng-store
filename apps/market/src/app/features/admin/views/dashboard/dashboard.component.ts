import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SessionService } from '@market-commons';
import { UserModel } from '@market/models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    RouterModule,
    CommonModule
  ],
  providers: []
})
export class DashboardComponent implements OnInit {
  user: UserModel;

  private readonly session = inject(SessionService);

  ngOnInit() {
    this.user = this.session.user;
  }
}

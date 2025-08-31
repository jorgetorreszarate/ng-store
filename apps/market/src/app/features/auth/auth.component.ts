import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './auth.component.html'
})
export class AuthComponent { }

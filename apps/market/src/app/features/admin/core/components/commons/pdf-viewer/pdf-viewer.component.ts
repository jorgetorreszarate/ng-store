import { NgClass } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { SafeUrlPipe } from '@market-commons';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [NgClass, SafeUrlPipe]
})
export class PdfViewerComponent {
  size: string = '';
  blobUrl: string;
}

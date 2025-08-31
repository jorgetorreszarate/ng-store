import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'fileSize',
	standalone: true
})
export class FileSizePipe implements PipeTransform {
	transform(value: number) {
		var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
		if (!value) return '0 Byte';
		var i = parseInt(Math.floor(Math.log(value) / Math.log(1024)).toString());
		return Math.round((value / Math.pow(1024, i)) * 10) / 10 + ' ' + sizes[i];
	}

}

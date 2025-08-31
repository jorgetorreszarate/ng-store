export class Convert {

    static padStart(value: number, maxlength: number = 2): string {
        return value?.toString().padStart(maxlength, '0');
    }

    static toDateString(date: any): any {
        if (!date) return;

        if (typeof date === 'string') {
            date = new Date(date);
        }

        const year = date.getFullYear();
        const month = this.padStart(date.getMonth() + 1);
        const day = this.padStart(date.getDate());
        const hours = this.padStart(date.getHours());
        const minutes = this.padStart(date.getMinutes());
        const seconds = this.padStart(date.getSeconds());
        const milliseconds = date.getMilliseconds();

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
    }

    static toShortDateString(date: Date): any {
        if (!date) return;

        return date.toLocaleString("es-PE", { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
}
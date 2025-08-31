import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pluralize',
  standalone: true
})
export class PluralizePipe implements PipeTransform {

  transform(value: string, quantity: number): string {
    if (quantity === 1) {
      return value;
    }

    value = value.toLowerCase();

    const lastLetter = value.charAt(value.length - 1);

    switch (lastLetter) {
      case 's':
      case 'x':
      case 'z':
        return value; // Palabras que ya terminan en s, x o z no cambian
      case 'y':
        return value.slice(0, -1) + 'ies';
      default:
        // Reglas más comunes para palabras que terminan en vocal
        if ('aeo'.includes(lastLetter)) {
          return value + 's';
        } else if ('bcdfghijklmnñpqrstuvwxyz'.includes(lastLetter)) {
          // Aquí podríamos considerar reglas más específicas para palabras que terminan en i o u
          return value + 'es';
        }
    }

    // Casos especiales (palabras irregulares, etc.)
    // Aquí puedes agregar más lógica para manejar casos particulares

    // Por defecto, si no se cumple ninguna regla, agregar 's'
    return value + 's';
  }
}

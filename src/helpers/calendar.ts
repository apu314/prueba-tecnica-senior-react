import { Month, Color } from "../types/Calendar";

export const months: { [MonthId: number]: string } = {
  [Month.Enero]: 'Enero',
  [Month.Febreo]: 'Febrero',
  [Month.Marzo]: 'Marzo',
  [Month.Abril]: 'Abril',
  [Month.Mayo]: 'Mayo',
  [Month.Junio]: 'Junio',
  [Month.Julio]: 'Julio',
  [Month.Agosto]: 'Agosto',
  [Month.Septiembre]: 'Septiembre',
  [Month.Octubre]: 'Octubre',
  [Month.Nobiembre]: 'Noviembre',
  [Month.Diciembre]: 'Diciembre',
}

export const colors: { [ColorId: string]: string } = {
  [Color.Amarillo]: 'yellow',
  [Color.Azul]: 'blue',
  [Color.Blanco]: '#fff',
  [Color.Gris]: 'grey',
  [Color.Rojo]: 'red'
}

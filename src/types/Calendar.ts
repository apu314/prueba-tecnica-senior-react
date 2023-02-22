export interface Calendar {
    errorCode: number;
    errorMessage: null;
    datos: CalendarData[];
}

export interface CalendarData {
    fecha: number;
    tipoId: TipoID;
    tipoDs: TipoDs;
    color: Color;
}

export enum TipoID {
    Empty = "",
    F = "F",
    L = "L",
    P = "P",
    S = "S",
}

export enum TipoDs {
    DiaLaborable = "Dia Laborable",
    FestivoLaboral = "Festivo Laboral",
    FestivoLocal = "Festivo Local",
    FinDeSemana = "Fin de Semana",
    Puente = "Puente",
}

export enum Color {
    Amarillo = "AMARILLO",
    Azul = "AZUL",
    Blanco = "BLANCO",
    Gris = "GRIS",
    Rojo = "ROJO",
}

export enum Month {
    Enero = 1,
    Febreo,
    Marzo,
    Abril,
    Mayo,
    Junio,
    Julio,
    Agosto,
    Septiembre,
    Octubre,
    Nobiembre,
    Diciembre
}

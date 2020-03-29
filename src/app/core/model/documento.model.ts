import { Orientador } from './orientador.model';
import { SubArea } from './sub-area.model';
import { Curso } from './curso.model';
import { Autor } from './autor.model';
export class Documento {
    constructor(
        public id?: string,
        public titulo?: string,
        public autor?: Autor,
        public curso?: Curso,
        public orientador?: Orientador,
        public coorientador?: Orientador,
        public dataApresentacao?: Date,
        public dataPublicacao?: Date,
        public subAreas?: SubArea[],
        public palavrasChave?: string[],
        public isbn?: string
    ) {}
}
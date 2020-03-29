import { GrandeArea } from './grande-area.model';
import { NivelCurso } from './nivelCurso.enum';

export class Curso{
    constructor(
        public id?: string,
        public sigla?: string,
        public nome?: string,
        public nivel?: NivelCurso,
        public descricao?: string,
        public grandeArea?: GrandeArea
    ) {
    }
}

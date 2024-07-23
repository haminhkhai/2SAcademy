export interface ProgramDetail {
    id?: string;
    name: string;
    courseProgramId?: string;
}

export class ProgramDetail implements ProgramDetail {
    constructor(programDetail?: ProgramDetail) {
        if (programDetail) {
            Object.assign(this,programDetail);
        }
    }
}
export class Cattle {
  lom: string;
  lom5: string;
  cccId: string;
  dateGeb: Date;
  gender: string;
  breed: string;
  omCcc: number;
  ageCcc: number;
  genderCcc: number;
  breedCcc: number;
  checked: boolean;
  checkDate: Date;

  public toString(): string {
    return this.lom + '(' + this.lom5 + ')';
  }
}

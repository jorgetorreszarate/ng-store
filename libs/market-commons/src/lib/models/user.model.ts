export enum UserRol {
  admin = "ADMINISTRADOR",
  seller = "VENDEDOR"
}

export interface ITokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface TokenDecoded {
  personalId: number;
  name: string;
  fatherLastName: string;
  motherLastName: string;
  fullName: string;
  role: UserRol;
  email: string;
  companyId: number;
  sub: string;
  iat: number;
  exp: number;
}

export class TokenModel {
  personalId: number;
  name: string;
  fatherLastName: string;
  motherLastName: string;
  fullName: string;
  role: UserRol;
  email: string;
  companyId: number;
  sub: string;
  iat: number;
  exp: number;

  constructor(tokenDecoded: TokenDecoded) {
    this.personalId = tokenDecoded.personalId;
    this.name = tokenDecoded.name;
    this.fatherLastName = tokenDecoded.fatherLastName;
    this.motherLastName = tokenDecoded.motherLastName;
    this.fullName = tokenDecoded.fullName;
    this.role = tokenDecoded.role;
    this.email = tokenDecoded.email;
    this.companyId = tokenDecoded.companyId;
    this.sub = tokenDecoded.sub;
    this.iat = tokenDecoded.iat;
    this.exp = tokenDecoded.exp;
  }

  get isExpired(): boolean {
    return new Date().getTime() > this.exp * 1000;
  }
}

export class UserModel {
  token: TokenModel;
  userName: string;
  userRol: UserRol;
  personalId: number;
  nombre: string;
  apePaterno: string;
  apeMaterno: string;
  fullName: string;
  email: string;
  companyId: number;
  /* company: string; */

  constructor(tokenDecoded?: TokenDecoded) {
    if (tokenDecoded) {
      this.token = new TokenModel(tokenDecoded);

      this.userName = tokenDecoded.sub;
      this.userRol = tokenDecoded.role;
      this.personalId = tokenDecoded.personalId;
      this.nombre = tokenDecoded.name ?? '';
      this.apePaterno = tokenDecoded.fatherLastName ?? '';
      this.apeMaterno = tokenDecoded.motherLastName ?? '';
      this.fullName = tokenDecoded.fullName;
      this.email = tokenDecoded.email;
      this.companyId = tokenDecoded.companyId;
      /* this.company = tokenDecoded.company; */
    }
  }

  isAdmin() {
    return this.userRol === UserRol.admin;
  }

  isSeller() {
    return this.userRol === UserRol.seller;
  }

  hasRole(rols: UserRol[]) {
    return rols.includes(this.userRol);
  }
}

import { Injectable, inject } from '@angular/core';
import { ITokenResponse, TokenDecoded, TokenModel, UserModel } from '../models/user.model';
import { TokenJwt } from '../utils';
import { CryptoService } from './crypto.service';

// Una sola instancia del servicio en toda la aplicacion: providedIn: 'root'
@Injectable({ providedIn: 'root' })
export class SessionService {
  private _key = 'gBr77yPwYH';
  private _dataStorage: ITokenResponse;
  private _tokenDecoded: TokenDecoded;

  private readonly crypto = inject(CryptoService);

  get user(): UserModel {
    return this.token ? new UserModel(this.tokenDecoded) : null;
  }

  get token(): string | null {
    try {
      const _dataStorage = this.dataStorage;
      const _tokenModel = new TokenModel(this.tokenDecoded);

      return _tokenModel.isExpired ? null : _dataStorage.access_token;
    } catch (e) {
      return null;
    }
  }

  get tokenDecoded(): TokenDecoded {
    this._tokenDecoded = this._tokenDecoded || TokenJwt.decode(this.dataStorage.access_token);
    return this._tokenDecoded;
  }

  get dataStorage(): ITokenResponse {
    try {
      this._dataStorage = this._dataStorage ||
        JSON.parse(this.crypto.get(localStorage.getItem(this._key))) as ITokenResponse;

      return this._dataStorage;
    } catch (e) {
      return null;
    }
  }

  create(token: ITokenResponse): void {
    this._tokenDecoded = null;
    this._dataStorage = null;
    localStorage.setItem(this._key, this.crypto.set(JSON.stringify(token)));
  }

  destroy(): void {
    this._tokenDecoded = null;
    this._dataStorage = null;
    localStorage.removeItem(this._key);
  }

}

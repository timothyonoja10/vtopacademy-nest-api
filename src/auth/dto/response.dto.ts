export class ResponseDto {
  readonly accesToken: string;
  readonly isAdmin: boolean;
  readonly isUser: boolean;
  
  constructor(accessToken: string, isAdmin: boolean, isUser: boolean) {
    this.accesToken = accessToken;
    this.isAdmin = isAdmin;
    this.isUser = isUser;
  }
}
export class ResponseDto {
  readonly accessToken: string;
  readonly isAdmin: boolean;
  readonly isUser: boolean;
  
  constructor(accessToken: string, isAdmin: boolean, isUser: boolean) {
    this.accessToken = accessToken;
    this.isAdmin = isAdmin;
    this.isUser = isUser;
  }
}
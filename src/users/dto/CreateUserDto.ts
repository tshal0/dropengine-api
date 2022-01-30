export class CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface CreateAuth0UserDto {
  client_id:   string;
  email:       string;
  password:    string;
  connection:  string;
  username?:    string;
  given_name?:  string;
  family_name?: string;
  name?:        string;
  nickname?:    string;
  picture?:     string;
}
export interface CreateAuth0UserResponseDto {
  _id:            string;
  email_verified: boolean;
  email:          string;
  username:       string;
  given_name:     string;
  family_name:    string;
  name:           string;
  nickname:       string;
  picture:        string;
}

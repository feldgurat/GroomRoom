export interface User {
  id: string;
  name: string;
  login: string;
  email: string;
  role: 'user' | 'admin';
  created_at: string;
}

export interface Order {
  id: string;
  pet_name: string;
  source_photo_path: string;
  result_photo_path: string | null;
  status: 'new' | 'processing' | 'done';
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface RegisterPayload {
  name: string;
  login: string;
  email: string;
  password: string;
  password_repeat: string;
  consent: boolean;
}

export interface ApiValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

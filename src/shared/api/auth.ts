import { AUTH_TOKEN_TTL_MS, MOCK_API_DELAY_MS } from '../config';
import { createFakeJwt } from '../lib';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export const loginRequest = async ({ email }: LoginCredentials): Promise<LoginResponse> => {
  await delay(MOCK_API_DELAY_MS);

  return { token: createFakeJwt(email, AUTH_TOKEN_TTL_MS) };
};

export const parseJwtToken = (
  t: string,
): { exp: number; iat: number; jti: string; token_type: string; user_id: string } => {
  const payload = t.split('.')[1];
  const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
  return JSON.parse(decodeURIComponent(escape(json)));
};

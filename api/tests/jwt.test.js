import { decodeJWT } from './jwt.js';

describe('decodeJWT', () => {
  it('devrait décoder un token JWT valide', () => {
    const fakeToken = 'header.eyJpZCI6MSwicHJlbm9tIjoiSmVhbiIsIm5vbSI6IkR1cG9udCIsImVtYWlsIjoiamVhbkBleGFtcGxlLmNvbSIsImlkX3JvbGUiOjJ9.signature';

    const decoded = decodeJWT(fakeToken);

    expect(decoded).toEqual({
      id: 1,
      prenom: 'Jean',
      nom: 'Dupont',
      email: 'jean@example.com',
      id_role: 2,
    });
  });

  it('devrait lever une erreur si token mal formé', () => {
    expect(() => decodeJWT('tokeninvalide')).toThrow();
  });
});

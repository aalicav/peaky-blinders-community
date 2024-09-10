import { NextRequest, NextResponse } from 'next/server';
import { validateToken } from '@/utils/jwt';

export function authMiddleware(req: NextRequest) {
  const token = req.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 });
  }

  const decodedToken = validateToken(token);
  if (!decodedToken) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }

  // Adiciona o usuário decodificado à requisição para uso posterior
  req.headers.set('X-User-Id', decodedToken.userId);
  req.headers.set('X-User-Email', decodedToken.email);
  req.headers.set('X-User-Roles', decodedToken.roles.join(','));

  return NextResponse.next();
}
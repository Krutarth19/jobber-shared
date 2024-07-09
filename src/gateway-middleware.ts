import JWT from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from './error-handler';

const tokens: string[] = [
  'auth',
  'seller',
  'gig',
  'search',
  'buyer',
  'message',
  'order',
  'review',
];

export function verifyGatewayRequest(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  if (!req.headers?.gatewaytoken) {
    throw new NotAuthorizedError(
      'Invalid request',
      'verifyGatewayRequest() method: Request is not coming from api gateway'
    );
  }

  const token: string = req.headers?.gatewaytoken as string;

  if (!token) {
    throw new NotAuthorizedError(
      'Invalid request',
      'verifyGatewayRequest() method: Request is not coming from api gateway'
    );
  }

  try {
    const payload: { id: string; iat: number } = JWT.verify(
      token,
      '54e1b393f'
    ) as {
      id: string;
      iat: number;
    };

    if (!token.includes(payload.id)) {
      throw new NotAuthorizedError(
        'Invalid request',
        'verifyGatewayRequest() method: Request is not coming from api gateway'
      );
    }
  } catch (error) {
    throw new NotAuthorizedError(
      'Invalid request',
      'verifyGatewayRequest() method: Request is not coming from api gateway'
    );
  }
  next();
}

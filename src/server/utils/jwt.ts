import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET

export interface JwtPayload{
  id:string;
  email: string;
  role: string
}

export const signToken = (payload: JwtPayload) => {
  return jwt.sign(payload, JWT_SECRET!, { expiresIn: '7d' });
}

export const verifyToken = (token:string):JwtPayload | null =>{
  if(!JWT_SECRET) throw new Error("JWT_SECRET is not defined");
  try{
    return jwt.verify(token, JWT_SECRET) as unknown as JwtPayload;
  }catch(e){
    return null;
  }
}
import supabase from './Connect';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_jwt_secret';

export const registerUser = async (email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const { data, error } = await supabase
    .from('users')
    .insert([{ email, password: hashedPassword }]);

  if (error) throw error;
  return data;
};

export const loginUser = async (email, password) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, password')
    .eq('email', email)
    .single();

  if (error) throw error;

  const validPassword = await bcrypt.compare(password, data.password);
  if (!validPassword) throw new Error('Invalid password');

  const token = jwt.sign({ id: data.id, email: data.email }, JWT_SECRET, { expiresIn: '1h' });
  return { token };
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};
import supabase from './Connect';
import { decodeJWT, getAuthToken, removeAuthToken } from './authUtils';

export const getUserById = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

export const getUserByEmail = async (email) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) throw error;
  return data;
};


export const getUserByEmailOrUsername = async (email, username) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .or(`email.eq.${email},username.eq.${username}`)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const getServices = async (categorie = null, from = null, to = null) => {
  let query = supabase.from('services').select('*', { count: 'exact' })


  if (from && to) {
    query = query.range(from, to);
  }

  if (categorie) {
      query = query.eq('categorie', categorie);
  }

  const { data, count, error } = await query;
  if (error) throw error;
  return { data, count };
};



  export const getCategories = async (categoryId = null) => {
    let query = supabase.from('categories').select('*').order('id', { ascending: true });
  
    if (categoryId) {
      query = query.eq('id', categoryId).single();
    }
  
    const { data, error } = await query;
    console.log(data);
  
    if (error) throw error;
    return data;
  };
  


export const getUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*');
  
  if (error) throw error;
  return data;
};

///////////////////////////
// Login
///////////////////////////
export const checkUserSession = async () => {
  const tokenData = getAuthToken();
  if (!tokenData) return null;

  try {
    let user;
    switch (tokenData.provider) {
      case 'email':
      case 'facebook':
        const decodedToken = decodeJWT(tokenData.token);
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', decodedToken.userId)
          .single();

        if (error) throw error;
        user = data;
        break;
      
      case 'google':
        const decodedGoogle = decodeJWT(tokenData.token);
        console.log("checkUserSession, ", decodedGoogle);
        const { data: existingUsers, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('email', decodedGoogle.email)
          .single();

          console.log("EMAIL USER", decodedGoogle.email);
          console.log("SUPABASE,", existingUsers);
        
        if (userError) throw userError;

        if (!existingUsers) {
          throw new Error('User not found in database');
        } else if (existingUsers.length > 1) {
          throw new Error('Multiple users found for the same email');
        }

        user = existingUsers;
        break;
      
      default:
        throw new Error('Unknown login provider');
    }

    return user;
  } catch (error) {
    console.error('Error checking user session:', error.message);
    return null;
  }
};


export async function getReviews() {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
}
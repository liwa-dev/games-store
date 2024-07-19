  import supabase from './Connect';

  export const addService = async (service) => {
    // Remove the id field from the service object
    const { id, ...serviceWithoutId } = service;
    
    const { data, error } = await supabase
      .from('services')
      .insert([serviceWithoutId])
      .select();

    if (error) {
      console.error('Error adding service:', error);
      throw error;
    }
    
    return data;
  };

  export const updateService = async (service) => {
    const { data, error } = await supabase
      .from('services')
      .update(service)
      .eq('id', service.id)
      .select();

    if (error) {
      console.error('Error updating service:', error);
      throw error;
    }

    return { data, count: data ? data.length : 0 };
  };

  export const deleteService = async (serviceId) => {
    const { data, error } = await supabase
      .from('services')
      .delete()
      .eq('id', serviceId);

    if (error) throw error;
    return data;
  };

  // The rest of your code remains unchanged
  export const addUser = async (user) => {
    console.log('Attempting to add user:', user);
    const { data, error } = await supabase
      .from('users')
      .insert([{
        username: user.username,
        email: user.email,
        password: user.password,
        role: user.role,
        're-password': user['re-password']
      }])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    console.log('User added successfully:', data);
    return data;
  };

  export const updateUser = async (user) => {
    const { data, error } = await supabase
      .from('users')
      .update({
        username: user.username,
        email: user.email,
        password: user.password,
        role: user.role,
        're-password': user['re-password']
      })
      .eq('id', user.id)
      .select();

    if (error) {
      console.error('Error updating user:', error);
      throw error;
    }

    return { data, count: data ? data.length : 0 };
  };

  export const deleteUser = async (userId) => {
    const { data, error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) throw error;
    return data;
  };


  ///////////////////////////
  // Login
  ///////////////////////////


  function createToken(user) {
    const now = new Date()
    const expirationTime = new Date(now.getTime() + 60 * 60 * 1000) // 1 hour from now
    return btoa(JSON.stringify({
      userId: user.id,
      email: user.email,
      exp: expirationTime.getTime()
    }))
  }


  const SALT = 'Vd@9q!Jx$6#K5rE$uPz8Z^G1*B2mR7A&F3cN!y%T8wP9kL0@3X%Z5^D1J!Uq'

  // Helper function to hash password
  async function hashPassword(password) {
    const encoder = new TextEncoder()
    const data = encoder.encode(password + SALT)
    const hash = await crypto.subtle.digest('SHA-256', data)
    return btoa(String.fromCharCode.apply(null, new Uint8Array(hash)))
  }

  export const registerUser = async (username, email, password) => {
    try {
      const hashedPassword = await hashPassword(password)
  
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          username,
          email,
          password: hashedPassword,
        })
        .select()
        .single()
  
      if (error) {
        console.error('Supabase error:', error)
        throw new Error(error.message || 'Error during user registration')
      }
  
      if (!newUser) {
        console.error('User registration failed: No user data returned')
        throw new Error('User registration failed')
      }
  
      const token = createToken(newUser)
  
      return { user: newUser, token }
    } catch (error) {
      console.error('Error registering user:', error)
      throw error
    }
  }

  export const registerFacebookUser = async (user) => {
    // First, check if a user with this email already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single();
  
    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }
  
    if (existingUser) {
      // User already exists, throw a custom error
      throw new Error('User with this email already exists');
    }
  
    // If no existing user, proceed with registration
    const { data, error } = await supabase
      .from('users')
      .insert({
        username: user.name,
        email: user.email,
        password: null,
        "re-password": null,
        role: 'user',
        login_provider: 'facebook'
      })
      .select()
      .single();
  
    if (error) throw error;
    return data;
  }
  
  export const loginUser = async (email, password) => {
    try {
      const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
  
      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          throw new Error('User not found');
        }
        throw new Error(fetchError.message || 'Error during login');
      }
  
      const hashedPassword = await hashPassword(password);
  
      if (user.password !== hashedPassword) {
        throw new Error('Invalid password');
      }
  
      const token = createToken(user)
  
      return { user, token };
    } catch (error) {
      console.error('Error logging in:', error.message);
      throw error;
    }
  };


  export const registerGoogleUser = async (credential) => {
    try {
      // Decode the Google credential
      const decodedCredential = JSON.parse(atob(credential.split('.')[1]));
      const { email, name, sub } = decodedCredential;
  
      // Check if user already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
  
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
  
      if (existingUser) {
        // User already exists, return the existing user
        return { user: existingUser, token: credential };
      }
  
      // If no existing user, proceed with registration
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          username: name,
          email: email,
          password: null,
          "re-password": null,
          role: 'user',
          login_provider: 'google',
        })
        .select()
        .single();
  
      if (error) throw error;
  
      return { user: newUser, token: credential };
    } catch (error) {
      console.error('Error registering Google user:', error);
      throw error;
    }
  };


  export async function addReview(review) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([review]);
  
      if (error) throw error;
  
      return data;
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  }
  
  export async function updateReview(id, review) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update(review)
        .match({ id });
  
      if (error) throw error;
  
      return data;
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  }
  
  export async function deleteReview(id) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .delete()
        .match({ id });
  
      if (error) throw error;
  
      return data;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }
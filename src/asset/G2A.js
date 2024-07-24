import axios from 'axios';
import crypto from 'crypto-js';

const clientId = 'youre id client here'; // API Client ID
const clientSecret = 'Your"e client secret here'; // customer Client secret
const email = 'youre email here'; // customer email

const apiKey = crypto.SHA256(clientId + email + clientSecret).toString(crypto.enc.Hex);

export const G2A = async (page) => {
  try {
    const response = await axios.get(`https://api.g2a.com/v1/products?page=${page}&updatedAtFrom=2024-07-18 12:00:00`, {
      headers: {
        'Authorization': `${clientId}, ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    // Output the response data to console
    return response.data;
  } catch (error) {
    console.error('Error fetching G2A products:', error.response ? error.response.data : error.message);
    throw error;
  }
};

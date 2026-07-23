import axios from 'axios'

export const payment = (token) => {
  return axios.post("https://ecom427-api.vercel.app/api/user/create-payment-intent", 
    {},
    {
      headers: {
        Authorization: `Bearer ${token}` 
      }
    }
  );
};
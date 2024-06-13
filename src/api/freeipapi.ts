import axios from 'axios';

export async function getUserCountryCode() {
  const { data } = await axios.get('https://freeipapi.com/api/json');
  return data.countryCode as string;
}

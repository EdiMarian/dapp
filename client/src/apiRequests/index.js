import axios from 'axios';

const api = 'https://api.elrond.com';

const http = axios.create({
  baseURL: api,
  headers: { 'Content-Type': 'application/json' }
});

const collection = 'EQUISTAR-3f393f';
const token = 'ESTAR-afaaf0';

export const getNfts = async (wallet) => {
  try {
    const { data } = await http.get(
      '/accounts/' + wallet + '/nfts?collection=' + collection
    );
    return {
      data: data,
      success: true
    };
  } catch (error) {
    return {
      data: error.response.data,
      success: false
    };
  }
};

export const NbNftsMint = async () => {
  try {
    const { data } = await http.get('/nfts/count?collection=' + collection);
    return {
      data: data,
      success: true
    };
  } catch (error) {
    return {
      data: error.response.data,
      success: false
    };
  }
};

export const fetchEstarWallet = async (wallet) => {
  try {
    const { data } = await http.get(
      '/accounts/' + wallet + '/tokens?identifier=' + token
    );
    return {
      data: data,
      success: true
    };
  } catch (error) {
    return {
      data: error.response.data,
      success: false
    };
  }
};

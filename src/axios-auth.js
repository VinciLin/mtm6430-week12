import axios from 'axios';

const instance = axios.create({
  baseURL:
    // original one , however want to use it groblly, so change this into the next line
    // "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]"
    'https://identitytoolkit.googleapis.com/v1/'
})

export default instance

import axios from 'axios';

const api = axios.create({baseURL : "https://backend-forever-ten.vercel.app/api"})

export default api;
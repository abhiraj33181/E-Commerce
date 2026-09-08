import axios from "axios";

export const api = axios.create({
  baseURL: "http://192.168.31.71:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
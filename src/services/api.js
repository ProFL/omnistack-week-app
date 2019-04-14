import axios from "axios";

const api = axios.create({
  baseURL: "https://oministack-week.herokuapp.com/"
});

export default api;

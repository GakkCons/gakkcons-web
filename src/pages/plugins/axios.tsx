import axios from "axios";

axios.defaults.baseURL = "http://192.168.1.47:5000/api";
axios.defaults.headers.post["Content-Type"] = "application/json";


export default axios;

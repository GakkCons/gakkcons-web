import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000/api/";
axios.defaults.headers.post["Content-Type"] = "application/json";


export default axios;

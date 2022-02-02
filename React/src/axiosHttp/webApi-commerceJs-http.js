import axios from "axios";

export default axios.create({
    baseURL: "https://localhost:44307/api/CommerceJs",
    headers: {
        "Content-type": "application/json"
    }
});
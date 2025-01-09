import axios from "axios";

const URL = process.env.BACKEND_API_URL || 'http://localhost:8080/rest/';

export const useAPI = () => {
    return axios.create({
        baseURL: URL,
    });
};
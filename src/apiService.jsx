import axios from 'axios';

// const API_BASE_URL = 'https://cors-dashboard-backend-2.vercel.app';
// Local Host URL
// const API_BASE_URL = 'http://127.0.0.1:9000';
const API_BASE_URL = 'http://35.9.242.16:9000';


const sendJsonData = (inputData) => {
    return axios.post(`${API_BASE_URL}/api/json/`, { input: inputData });
};

export default sendJsonData;

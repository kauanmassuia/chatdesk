import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

export const saveAnswer = async (customUrl: string, answerData: object) => {
  const accessToken = localStorage.getItem("access-token");
  const client = localStorage.getItem("client");
  const uid = localStorage.getItem("uid");

  const response = await axios.post(
    `${API_BASE_URL}/answers/save_answer`,
    {
      custom_url: customUrl,
      answer: { answer_data: answerData }
    },
    {
      headers: { 'access-token': accessToken, client, uid },
      withCredentials: true,
    }
  );
  return response.data;
};

// import axios from 'axios';

// const API_URL = 'http://localhost:5000/api/posts';

// export const getPosts = () => axios.get(API_URL);
// export const getPost = (id) => axios.get(`${API_URL}/${id}`);
// export const createPost = (data) => axios.post(API_URL, data);
// // export const updatePost = (id, data) => axios.put(`${API_URL}/${id}`, data);
// export const deletePost = (id) => axios.delete(`${API_URL}/${id}`);
// export const updatePost = async (id, updatedData) => {
//     const response = await axios.put(`${API_URL}/${id}`, updatedData);
//     return response.data;
// };



import axios from 'axios';

// const API_URL = 'http://localhost:5000/api/posts';
const API_URL = 'https://postapp-server.onrender.com/api/posts/';

// Fetch all posts
export const getPosts = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

// Create a new post
export const createPost = async (post) => {
    const response = await axios.post(API_URL, post);
    return response.data;
};

// Update a post by ID
export const updatePost = async (id, updatedPost) => {
    const response = await axios.put(`${API_URL}/${id}`, updatedPost);
    return response.data;
};

// Delete a post by ID
export const deletePost = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};

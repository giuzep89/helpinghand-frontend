import axios from "axios";
import { getToken } from "./getToken.js";

const BASE_URL = "http://localhost:8080";

// Authentication ---------------------------------------------------

export async function loginUser(username, password) {
    const response = await axios.post(`${BASE_URL}/auth/login`, { username, password });
    const authHeader = response.headers['authorization'];
    const jwt = authHeader?.replace('Bearer ', '');
    return { jwt, ...response.data };
}

export async function registerUser(email, username, password, age, location, competencies) {
    const response = await axios.post(`${BASE_URL}/auth/register`, {
        email,
        username,
        password,
        age: age ? parseInt(age) : null,
        location: location || null,
        competencies: competencies || null
    });
    return response.data;
}

// Posts ---------------------------------------------------

export async function getAllPosts(page = 0, size = 20) {
    const response = await axios.get(`${BASE_URL}/posts?page=${page}&size=${size}`, { headers: getToken() });
    return response.data;
}

export async function createHelpRequest(description, helpType, location) {
    const response = await axios.post(`${BASE_URL}/posts/help-requests`, { description, helpType, location }, { headers: getToken() });
    return response.data;
}

export async function createActivity(description, activityType, location, eventDate) {
    const response = await axios.post(`${BASE_URL}/posts/activities`, { description, activityType, location, eventDate }, { headers: getToken() });
    return response.data;
}

export async function deletePost(postId) {
    await axios.delete(`${BASE_URL}/posts/${postId}`, { headers: getToken() });
}

export async function markHelpFound(postId, helperUserIds) {
    const response = await axios.patch(`${BASE_URL}/posts/help-requests/${postId}/help-found`, helperUserIds, { headers: getToken() });
    return response.data;
}

export async function joinActivity(postId) {
    const response = await axios.post(`${BASE_URL}/posts/activities/${postId}/join`, {}, { headers: getToken() });
    return response.data;
}

// Chats ---------------------------------------------------

export async function getAllChats() {
    const response = await axios.get(`${BASE_URL}/chats`, { headers: getToken() });
    return response.data;
}

export async function createChat(recipientUserId) {
    // Takes raw user ID number, not an object
    const response = await axios.post(`${BASE_URL}/chats`, recipientUserId, {
        headers: { ...getToken(), "Content-Type": "application/json" }
    });
    return response.data;
}

export async function getChatMessages(chatId) {
    const response = await axios.get(`${BASE_URL}/chats/${chatId}/messages`, { headers: getToken() });
    return response.data;
}

export async function sendMessage(chatId, content) {
    const response = await axios.post(`${BASE_URL}/chats/${chatId}/messages`, { content }, { headers: getToken() });
    return response.data;
}

// Users ---------------------------------------------------

export async function searchUsers(query) {
    const response = await axios.get(`${BASE_URL}/users?q=${query}`, { headers: getToken() });
    return response.data;
}

export async function getUserProfile(username) {
    const response = await axios.get(`${BASE_URL}/users/${username}`, { headers: getToken() });
    return response.data;
}

export async function updateUserProfile(username, age, location, competencies) {
    const response = await axios.put(`${BASE_URL}/users/${username}`, { age, location, competencies }, { headers: getToken() });
    return response.data;
}

export async function getUserFriends(username) {
    const response = await axios.get(`${BASE_URL}/users/${username}/friends`, { headers: getToken() });
    return response.data;
}

export async function addFriend(username, friendUserId) {
    // Takes raw user ID number, not an object
    const response = await axios.post(`${BASE_URL}/users/${username}/friends`, friendUserId, {
        headers: { ...getToken(), "Content-Type": "application/json" }
    });
    return response.data;
}

export async function removeFriend(username, friendId) {
    await axios.delete(`${BASE_URL}/users/${username}/friends/${friendId}`, { headers: getToken() });
}

// Profile picture ---------------------------------------------------

export function getProfilePictureUrl(username) {
    return `${BASE_URL}/users/${username}/profile-picture`;
}

export async function uploadProfilePicture(username, file) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(`${BASE_URL}/users/${username}/profile-picture`, formData, {
        headers: {
            ...getToken(),
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
}

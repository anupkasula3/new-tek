import axios, { AxiosRequestConfig } from "axios";

import BASE_URL from "./global";


export const api = axios.create({
    baseURL: BASE_URL + "/api",
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
    // withCredentials: true,
});

// GET
export const fetchData = async <T>(
    url: string,
    config?: AxiosRequestConfig,
): Promise<T> => {
    try {
        const response = await api.get<T>(url, config);
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}

// POST
export const postData = async <T>(
    url: string,
    data: unknown,
    config?: AxiosRequestConfig,
): Promise<T> => {
    const response = await api.post<T>(url, data, config);
    return response.data;
};

// PUT / PATCH
export const updateData = async <T>(
    url: string,
    data: unknown,
    config?: AxiosRequestConfig,
): Promise<T> => {
    const response = await api.put<T>(url, data, config);
    return response.data;
};

// DELETE
export const deleteData = async <T>(
    url: string,
    config?: AxiosRequestConfig,
): Promise<T> => {
    const response = await api.delete<T>(url, config);
    return response.data;
};

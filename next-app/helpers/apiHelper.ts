import {LazyDataSourceApiResponse} from "@epam/uui";

export const HEADERS = {
    'content-type': 'application/json;charset=UTF-8',
    origin: '*',
};

export const UUI_API_POINT = 'https://uui.epam.com/api';

export const fetcher = async (url: string, options?: RequestInit) => {
    const res = await fetch(url, { headers: HEADERS, method: 'GET', ...options });
    const data = await res.json();

    if (res.status !== 200) {
        throw new Error(data.message);
    }
    return data;
};
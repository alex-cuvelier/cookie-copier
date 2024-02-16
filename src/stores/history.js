import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

export const useHistoryStore = defineStore('history', () => {
    const history = useLocalStorage('history', []);

    const pushHistory = (item) => {
        history.value.push(item);
    };

    return { history, pushHistory };
});

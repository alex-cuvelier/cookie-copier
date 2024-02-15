import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

export const useHistoryStore = defineStore('history', () => {
    const history = useLocalStorage('history', []);

    const pushHistory = (item) => {
        console.log("in pushHistory", item, history.value)
        history.value.push(item);
    };

    return { history, pushHistory };
});

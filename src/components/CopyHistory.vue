<template>
    <div>
        <DataTable 
            :value="history" 
            v-model:expandedRows="expandedRows" 
            :size="'small'" 
            scrollable 
            class="cookies-table mb-5"
            sortField="date" 
            sortOrder="-1">
            <Column expander style="width: 5rem" />
            <Column field="source" header="Source"></Column>
            <Column field="target" header="Target"></Column>
            <Column field="date" header="Date"></Column>
            <Column header="Count">
                <template #body="slotProps">
                    {{ slotProps.data.cookies.length }}
                </template>
            </Column>
            <Column header="Actions" frozen alignFrozen="right">
                <template #body="slotProps">
                    <Button rounded outlined icon="pi pi-replay" size="sm" @click="copyHistory(slotProps.data)"
                        class="size-8" v-tooltip.left="'Rerun this copy'"></Button>
                </template>
            </Column>
            <template #expansion="slotProps">
                <div class="w-100 p-1 max-w-full">
                    <CookiesTable :cookies="slotProps.data.cookies"></CookiesTable>
                </div>
            </template>
        </DataTable>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useHistoryStore } from '@/stores/history';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import CookiesTable from '@/components/CookiesTable.vue';


import { useToast } from 'primevue/usetoast';
const toast = useToast();

const { history } = useHistoryStore();
const expandedRows = ref([]);

const copyHistory = (historyItem) => {
    const promises = historyItem.cookies.map((cookie) => {
        return chrome.cookies.set({
            url: `http://${historyItem.target}`,
            name: cookie.name,
            value: cookie.value,
            domain: historyItem.target,
            path: cookie.path,
            expirationDate: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365
        });
    });

    //when all promises are done, set copyDone or copyError
    Promise.all(promises)
        .then(() => {
            toast.add({ severity: 'success', detail: `${historyItem.cookies.length} Cookie(s) copied`, life: 3000 });
        })
        .catch((err) => {
            console.error(err);
            toast.add({ severity: 'error', detail: 'Error copying cookie(s)', life: 3000 });
        });

};
</script>

<style lang="scss" scoped></style>

<template>
    <div class="flex gap-2">
        <div class="flex-1 flex flex-col">
            <label for="sourceDomain" class="mb-1">Source</label>
            <DomainSelector v-model="sourceDomain" inputId="sourceDomain" :placeholder="Source"/>
        </div>

        <div class="flex-1 flex flex-col">
            <label for="targetDomain" class="mb-1">Target</label>
            <DomainSelector v-model="targetDomain" inputId="targetDomain" :placeholder="Target"/>
        </div>
    </div>

    <div class="w-full p-2">
        <DataTable :value="sourceDomainCookies" :size="'small'" class="cookies-table mb-5"
            v-model:selection="selectedCookies" selectionMode="multiple" :metaKeySelection="metaKey">
            <Column field="name" header="Name"></Column>
            <Column field="domain" header="Domain"></Column>
            <Column field="value" header="Value"></Column>
            <Column field="partitionKey.topLevelSite" header="Partition"></Column>
            <template #empty>
                <div v-if="sourceDomain" class="text-center">No cookies for {{ sourceDomain }}</div>
                <div v-else class="text-center">Select a source domain</div>
            </template>
        </DataTable>
    </div>
    <div class="mt-2">
        <Button :disabled="!canCopy" @click="copyCookies"> Copy {{ selectedCookies.length }} cookies </Button>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { useHistoryStore } from '@/stores/history';
import DomainSelector from '@/components/DomainSelector.vue';

const toast = useToast();
const { pushHistory } = useHistoryStore();

const sourceDomain = ref('');
const targetDomain = ref('');

const selectedCookies = ref([]);
const sourceDomainCookies = ref([]);

//can copy if source and target domains are selected and at least one cookie is selected
const canCopy = computed(() => {
    return sourceDomain.value && targetDomain.value && selectedCookies.value.length;
});

const copyCookies = async () => {
    //for each selected cookie, set it on the target domain and save the promise
    const promises = selectedCookies.value.map((cookie) => {
        return chrome.cookies.set({
            url: `http://${targetDomain.value}`,
            name: cookie.name,
            value: cookie.value,
            domain: targetDomain.value,
            path: cookie.path,
            expirationDate: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365
        });
    });

    //when all promises are done, set copyDone or copyError
    Promise.all(promises)
        .then(() => {
            toast.add({ severity: 'success', detail: `${selectedCookies.value.length} Cookie(s) copied`, life: 3000 });

            pushHistory({
                action: 'copy',
                source: sourceDomain.value,
                target: targetDomain.value,
                cookies: selectedCookies.value,
                date: new Date().toISOString()
            });
        })
        .catch((err) => {
            console.error(err);
            toast.add({ severity: 'error', detail: 'Error copying cookie(s)', life: 3000 });
        });
};

//When source domain changes, get cookies for that domain
watch(sourceDomain, async (sourceDomain) => {
    const cookies = await chrome.cookies.getAll({ domain: sourceDomain, partitionKey: {} });
    console.log('cookies', cookies);
    sourceDomainCookies.value = cookies;
    selectedCookies.value = [];
});
</script>

<style lang="scss">
.cookies-table {
    td {
        font-size: 0.875rem;
        //text on one line
        white-space: nowrap;
        overflow: hidden;
    }
}
</style>

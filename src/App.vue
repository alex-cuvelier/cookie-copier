<template>
    <div class="m-2">

        <div class="flex gap-2">


            <div class="flex-1 flex flex-col">
                <label for="sourceDomain" class="mb-1">Source</label>
                <Dropdown v-model="sourceDomain" inputId="sourceDomain" :options="openedTabsDomains" placeholder="Source" />
            </div>

            <div class="flex-1 flex flex-col">
                <label for="targetDomain" class="mb-1">Target</label>
                <Dropdown v-model="targetDomain" inputId="targetDomain" :options="openedTabsDomains" placeholder="Target" />
            </div>

        </div>

        <DataTable :value="sourceDomainCookies" :size="'small'" class="cookies-table my-5" v-model:selection="selectedCookies" selectionMode="multiple" :metaKeySelection="metaKey">
            <Column></Column>
            <Column field="name" header="Name" sortable></Column>
            <Column field="value" header="Value" sortable></Column>
            <Column field="domain" header="Domain" sortable></Column>
            <Column field="expirationDate" header="Expiration Date" sortable></Column>
            <Column field="partitionKey.topLevelSite" header="Partition" sortable></Column>
            <template #empty>
                <template v-if="sourceDomain.value">
                    No cookies for {{ sourceDomain.value }}
                </template>
                <template v-else>
                    Select a source domain
                </template>
            </template>
        </DataTable>

        <div class="mt-2">
            <span v-if="copyDone" class="text-green-500">Copied</span>
            <span v-if="copyError" class="text-red-500">Error</span>
        </div>

        <div class="mt-2">
            <Button :disabled="!canCopy" @click="copyCookies">Copy cookies</Button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import Dropdown from 'primevue/dropdown';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';

const sourceDomain = ref('');
const targetDomain = ref('');
const openedTabsDomains = ref([]);

//get opened tabs domains on mount and save them in openedTabsDomains
const getOpenedTabs = async () => {
    const tabs = await chrome.tabs.query({});
    openedTabsDomains.value = [... new Set(tabs.map((tab) => new URL(tab.url).hostname))]
};
onMounted(getOpenedTabs);

const selectedCookies = ref([]);
const sourceDomainCookies = ref([]);

//can copy if source and target domains are selected and at least one cookie is selected
const canCopy = computed(() => {
    return sourceDomain.value && targetDomain.value && selectedCookies.value.length;
});

const copyDone = ref(false);
const copyError = ref(false);
const copyCookies = async () => {

    //filter cookies to copy
    const promises = [];

    //for each selected cookie, set it on the target domain and save the promise
    selectedCookies.value.forEach((cookie) => {
        promises.push(chrome.cookies.set({
            url: `http://${targetDomain.value}`,
            name: cookie.name,
            value: cookie.value,
            domain: targetDomain.value,
            path: cookie.path,
            //timetamp in one year
            expirationDate: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
        }));
    });

    //when all promises are done, set copyDone or copyError
    Promise.all(promises)
        .then(() => {
            copyDone.value = true;
        })
        .catch((err) => {
            console.error(err);
            copyError.value = true;
        });
};

//When source domain changes, get cookies for that domain
watch(sourceDomain, async (sourceDomain) => {
    const cookies = await chrome.cookies.getAll({ domain: sourceDomain, partitionKey: {} });
    console.log('cookies', cookies)
    sourceDomainCookies.value = cookies;
    selectedCookies.value = [];
});

//When form changes, reset copy status
watch([sourceDomain, targetDomain, selectedCookies], () => {
    copyDone.value = false;
    copyError.value = false;
    console.log(selectedCookies.value)
});
</script>

<style lang="scss">
    .cookies-table{
        td{
            font-size: 0.875rem;
            //text on one line
            white-space: nowrap;
            overflow: hidden;
        }
    }
</style>

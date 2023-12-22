<template>
    <div class="m-2">
        <div class="flex flex-col">
            <label for="sourceDomain" class="mb-1">Source</label>
            <Dropdown v-model="sourceDomain" inputId="sourceDomain" :options="openedTabsUrls" placeholder="Source" />
        </div>

        <div class="flex flex-col mt-2 max-h-64 overflow-y-auto">
            <div v-for="(cookie, index) in sourceDomainCookies" class="flex items-center mt-1">
                <Checkbox v-model="selectedCookies" :inputId="`cookie_${index}`" :value="cookie.name" />
                <label :for="`cookie_${index}`" class="ml-2"> {{ cookie.name }} </label>
            </div>
        </div>

        <div class="flex flex-col mt-2">
            <label for="targetDomain" class="mb-1">Target</label>
            <Dropdown v-model="targetDomain" inputId="targetDomain" :options="openedTabsUrls" placeholder="Target" />
        </div>

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
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';

const sourceDomain = ref('');
const targetDomain = ref('');
const openedTabsUrls = ref([]);
const getOpenedTabs = () => {
    chrome.tabs.query({}, function (tabs) {
        openedTabsUrls.value = tabs.map((tab) => new URL(tab.url).hostname);
    });
};
onMounted(getOpenedTabs);

const selectedCookies = ref([]);

const sourceDomainCookies = ref([]);

const canCopy = computed(() => {
    return sourceDomain.value && targetDomain.value && selectedCookies.value.length;
});

const copyDone = ref(false);
const copyError = ref(false);
const copyCookies = () => {
    chrome.cookies.getAll({ domain: sourceDomain.value }, function (cookies) {
        const cookiesToCopy = cookies.filter((cookie) => selectedCookies.value.includes(cookie.name));
        const promises = [];
        cookiesToCopy.forEach((cookie) => {
            const newCookie = {
                url: `http://${targetDomain.value}`,
                name: cookie.name,
                value: cookie.value,
                domain: targetDomain.value,
                path: cookie.path,
                expirationDate: cookie.expirationDate
            };
            console.log('newCookie', newCookie);
            promises.push(chrome.cookies.set(newCookie));
        });
        Promise.all(promises)
          .then(() => {
            copyDone.value = true;
        }).catch((err) => {
            copyError.value = true;
        })
    });
};


watch(sourceDomain, (sourceDomain) => {
    chrome.cookies.getAll({ domain: sourceDomain }, function (cookies) {
        sourceDomainCookies.value = cookies;
    });
});

watch([sourceDomain, targetDomain, selectedCookies], () => {
    copyDone.value = false;
    copyError.value = false;
});
</script>

<style lang="scss" scoped></style>

<template>
    <div>
        <IconField iconPosition="left" class="m-3">
            <InputIcon>
                <i class="pi pi-search"></i>
            </InputIcon>
            <InputText v-model="searchFilter" placeholder="Search domain" class="w-full" />
        </IconField>
        <Accordion v-model:activeIndex="activeIndex">
            <AccordionTab v-for="(cookie, index) in cookies" :key="index">
                <template #header>
                    <div class="flex justify-between">
                        <div>
                            <span class="font-semibold">{{ cookie.name }}</span>
                            <span class="text-xs ml-2">{{ cookie.domain }}</span>
                        </div>
                    </div>
                </template>
                <CookieForm v-if="activeIndex == index" :cookie="cookie" @cookieDeleted="searchCookies" />
            </AccordionTab>
        </Accordion>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import IconField from 'primevue/iconfield';
import InputText from 'primevue/inputtext';
import InputIcon from 'primevue/inputicon';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import CookieForm from '@/components/CookieForm.vue';
import { sorterByProperty } from '@/utils/utils';


const searchFilter = ref('');
onMounted(async () => {

    //is has url search param tabDomain use it, otherwise get tab url
    const urlParams = new URLSearchParams(window.location.search);
    const tabUrl = urlParams.get('tabUrl');
    if (tabUrl) {
        //rebuild url to remove hash
        const url = new URL(tabUrl);
        searchFilter.value = url.hostname;
    } else {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const url = new URL(tabs[0].url);
        searchFilter.value = url.hostname;
    }
});

const cookies = ref([]);
const activeIndex = ref(null);

watch(searchFilter, (newValue) => {
    if (newValue.length > 2) {
        searchCookies();
    } else {
        cookies.value = [];
    }
});

const searchCookies = async () => {
    console.log('searchCookies', searchFilter.value)
    const res = await chrome.cookies.getAll({ domain: searchFilter.value, partitionKey : {} });
    console.log(res);
    cookies.value = res.sort(sorterByProperty('name'));
    activeIndex.value = null;
};

searchCookies();

</script>

<style lang="scss" scoped></style>
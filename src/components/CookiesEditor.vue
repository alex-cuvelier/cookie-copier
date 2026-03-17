<template>
    <div>
        <IconField iconPosition="left" class="m-3">
            <InputIcon>
                <i class="pi pi-search"></i>
            </InputIcon>
            <InputText v-model="searchFilter" placeholder="Search domain" class="w-full" />
        </IconField>
        <Message v-if="searchFilter.length <= 2" severity="info" class="mx-3">Type at least 3 characters to search cookies</Message>
        <Message v-else-if="cookies.length === 0" severity="warn" class="mx-3">No cookies found</Message>
        <Accordion v-model:value="activeIndex">
            <AccordionPanel v-for="(cookie, index) in cookies" :key="index" :value="index">
                <AccordionHeader>
                    <span class="font-semibold">{{ cookie.name }}</span>
                    <span class="text-xs ml-2">{{ cookie.domain }}</span>
                </AccordionHeader>
                <AccordionContent>
                    <CookieForm :cookie="cookie" @cookieDeleted="searchCookies" />
                </AccordionContent>
            </AccordionPanel>
        </Accordion>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import IconField from 'primevue/iconfield';
import InputText from 'primevue/inputtext';
import InputIcon from 'primevue/inputicon';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import Message from 'primevue/message';
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
        if (!url.protocol.startsWith('chrome')) {
            searchFilter.value = url.hostname;
        }
    }
});

const cookies = ref([]);
const activeIndex = ref(null);

const searchCookies = async () => {
    console.log('searchCookies', searchFilter.value);
    const filter = searchFilter.value.toLowerCase();
    const res = await chrome.cookies.getAll({});
    cookies.value = res
        .filter((c) => c.domain.toLowerCase().includes(filter) || c.name.toLowerCase().includes(filter))
        .sort(sorterByProperty('name'));
    activeIndex.value = null;
};

watch(searchFilter, (newValue) => {
    if (newValue.length > 2) {
        searchCookies();
    } else {
        cookies.value = [];
    }
});
</script>

<style lang="scss" scoped></style>

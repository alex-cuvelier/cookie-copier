<template>
    <div>
        <IconField iconPosition="left">
            <InputIcon>
                <i class="pi pi-search"></i>
            </InputIcon>
            <InputText v-model="searchFilter" placeholder="Search domain" />
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
                <CookieForm  v-if="activeIndex == index" :cookie="cookie" />
            </AccordionTab>
        </Accordion>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import IconField from 'primevue/iconfield';
import InputText from 'primevue/inputtext';
import InputIcon from 'primevue/inputicon';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import CookieForm from '@/components/CookieForm.vue';

const searchFilter = ref('lemonde.fr');
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
    cookies.value = await chrome.cookies.getAll({ domain: searchFilter.value });
};

searchCookies();

</script>

<style lang="scss" scoped></style>
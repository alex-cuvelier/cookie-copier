<template>
    <Select
        v-model="modelValue"
        :inputId="props.inputId"
        filter
        :options="domains"
        @click="getDomains"
        :placeholder="props.placeholder"
        class="domain-select"
    >
        <template #header>
            <div class="domain-select__header">
                <SelectButton v-model="type" :options="['Tabs', 'All']" />
            </div>
        </template>
        <template #option="{ option }">
            <span class="font-mono" style="font-size: 0.78rem">{{ option }}</span>
        </template>
    </Select>
</template>

<script setup>
import Select from 'primevue/select';
import SelectButton from 'primevue/selectbutton';
import { ref, watch } from 'vue';

const modelValue = defineModel();
const type = ref('Tabs');
const props = defineProps({
    inputId: String,
    placeholder: String
});

const domains = ref([]);
const getDomains = () => {
    if (type.value === 'Tabs') {
        getOpenedTabsDomains();
    } else {
        getAllCookiesDomains();
    }
};
const getOpenedTabsDomains = async () => {
    const tabs = await chrome.tabs.query({});
    console.log(tabs);
    domains.value = [...new Set(tabs.map((tab) => new URL(tab.url).hostname))];
};

const getAllCookiesDomains = async () => {
    const cookies = await chrome.cookies.getAll({});
    console.log(cookies);
    domains.value = [...new Set(cookies.map((cookie) => cookie.domain))];
};

watch(type, getDomains, { immediate: true });
</script>

<style lang="scss" scoped>
.domain-select {
    width: 100%;

    &__header {
        display: flex;
        justify-content: center;
        padding: 0.5rem 0;
    }
}
</style>

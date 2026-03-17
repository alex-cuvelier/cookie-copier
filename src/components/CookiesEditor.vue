<template>
    <div class="editor stagger-children">
        <!-- Search -->
        <div class="editor__search">
            <div class="editor__search-field">
                <i class="pi pi-search editor__search-icon"></i>
                <InputText
                    v-model="searchFilter"
                    placeholder="Search by domain or cookie name..."
                    class="editor__search-input"
                />
            </div>
        </div>

        <!-- Messages -->
        <Message v-if="searchFilter.length <= 2" severity="info" class="editor__msg">
            Type at least 3 characters to search cookies
        </Message>
        <Message v-else-if="cookies.length === 0" severity="warn" class="editor__msg">
            No cookies found
        </Message>

        <!-- Results count -->
        <div v-if="cookies.length" class="editor__results-bar">
            <span class="cc-label">Results</span>
            <span class="cc-badge cc-badge--green">{{ cookies.length }} cookie{{ cookies.length !== 1 ? 's' : '' }}</span>
        </div>

        <!-- Cookie Accordion -->
        <div class="cc-card editor__list" v-if="cookies.length">
            <Accordion v-model:value="activeIndex">
                <AccordionPanel v-for="(cookie, index) in cookies" :key="index" :value="index">
                    <AccordionHeader>
                        <div class="editor__cookie-header">
                            <span class="editor__cookie-name">{{ cookie.name }}</span>
                            <span class="editor__cookie-domain">{{ cookie.domain }}</span>
                        </div>
                    </AccordionHeader>
                    <AccordionContent>
                        <CookieForm :cookie="cookie" @cookieDeleted="searchCookies" />
                    </AccordionContent>
                </AccordionPanel>
            </Accordion>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import InputText from 'primevue/inputtext';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import Message from 'primevue/message';
import CookieForm from '@/components/CookieForm.vue';
import { sorterByProperty } from '@/utils/utils';

const searchFilter = ref('');
onMounted(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabUrl = urlParams.get('tabUrl');
    if (tabUrl) {
        const url = new URL(tabUrl);
        if (!url.protocol.startsWith('chrome')) {
            searchFilter.value = url.hostname;
        }
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

<style lang="scss" scoped>
.editor {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    &__search {
        position: relative;
    }

    &__search-field {
        position: relative;
        display: flex;
        align-items: center;
    }

    &__search-icon {
        position: absolute;
        left: 0.75rem;
        color: var(--text-muted);
        font-size: 0.82rem;
        z-index: 1;
        pointer-events: none;
    }

    &__search-input {
        width: 100%;
        padding-left: 2.2rem !important;
    }

    &__msg {
        margin: 0 !important;
    }

    &__results-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    &__list {
        padding: 0 !important;
        overflow: hidden;
    }

    &__cookie-header {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        width: 100%;
        min-width: 0;
    }

    &__cookie-name {
        font-family: var(--font-mono);
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--accent-300);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    &__cookie-domain {
        font-size: 0.7rem;
        color: var(--text-muted);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex-shrink: 1;
        min-width: 0;
    }
}
</style>

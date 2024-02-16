<template>
    <div class="m-2">
        <TabView :activeIndex="0">
            <TabPanel header="Edit cookies">
                <CookiesEditor />
            </TabPanel>
            <TabPanel header="Copy cookies">
                <CopyByDomain />
            </TabPanel>
            <TabPanel header="History">
                <CopyHistory />
            </TabPanel>
        </TabView>
    </div>
    <Toast />
</template>

<script setup>
import Toast from 'primevue/toast';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

import CopyByDomain from '@/components/CopyByDomain.vue';
import CopyHistory from '@/components/CopyHistory.vue';
import CookiesEditor from '@/components/CookiesEditor.vue';
</script>

<style lang="scss">
</style>

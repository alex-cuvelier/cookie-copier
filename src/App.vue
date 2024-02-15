<template>
    <div class="m-2">
        <TabView :activeIndex="1">
            <TabPanel header="Copy by domains">
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
import CopyHistory from './components/CopyHistory.vue';
</script>

<style lang="scss">
</style>

<template>
    <div class="m-2">
        <Tabs value="0">
            <TabList>
                <Tab value="0">Copy cookies test</Tab>
                <Tab value="1">History</Tab>
                <Tab value="2">Explore cookies</Tab>
            </TabList>
            <TabPanels>
                <TabPanel value="0">
                    <CopyByDomain />
                </TabPanel>
                <TabPanel value="1">
                    <CopyHistory />
                </TabPanel>
                <TabPanel value="2">
                    <CookiesEditor />
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
    <Toast />
</template>

<script setup>
import Toast from 'primevue/toast';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';

import CopyByDomain from '@/components/CopyByDomain.vue';
import CopyHistory from '@/components/CopyHistory.vue';
import CookiesEditor from '@/components/CookiesEditor.vue';
</script>

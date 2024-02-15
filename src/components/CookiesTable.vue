<template>
        <DataTable :value="props.cookies" :size="'small'" class="cookies-table">
            <Column field="name" header="Name"></Column>
            <Column field="domain" header="Domain"></Column>
            <Column field="path" header="Path"></Column>
            <Column field="expirationDate" header="ExpirationDate"></Column>
            <Column field="hostOnly" header="HostOnly"></Column>
            <Column field="httpOnly" header="HttpOnly"></Column>
            <Column field="sameSite" header="SameSite"></Column>
            <Column field="secure" header="Secure"></Column>
            <Column field="session" header="Session"></Column>
            <Column field="storeId" header="StoreId"></Column>
            <Column field="value" header="Value"></Column>
        </DataTable>
</template>

<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
const props = defineProps({
    cookies: {
        type: Array,
        required: true
    }
});
</script>

<style lang="scss" scoped>

</style>
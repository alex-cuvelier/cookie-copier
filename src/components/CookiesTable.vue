<template>
    <DataTable :value="props.cookies" :size="'small'" scrollable>
        <Column field="name" header="Name"></Column>
        <Column field="domain" header="Domain"></Column>
        <Column field="path" header="Path"></Column>
        <Column field="expirationDate" header="Expires"></Column>
        <Column field="httpOnly" header="httpOnly">
            <template #body="slotProps">
                <span :class="slotProps.data.httpOnly ? 'cc-badge cc-badge--green' : 'cc-badge cc-badge--slate'">
                    {{ slotProps.data.httpOnly ? 'yes' : 'no' }}
                </span>
            </template>
        </Column>
        <Column field="secure" header="Secure">
            <template #body="slotProps">
                <span :class="slotProps.data.secure ? 'cc-badge cc-badge--green' : 'cc-badge cc-badge--slate'">
                    {{ slotProps.data.secure ? 'yes' : 'no' }}
                </span>
            </template>
        </Column>
        <Column field="sameSite" header="SameSite">
            <template #body="slotProps">
                <span class="cc-badge cc-badge--amber">{{ slotProps.data.sameSite }}</span>
            </template>
        </Column>
        <Column field="session" header="Session">
            <template #body="slotProps">
                <span :class="slotProps.data.session ? 'cc-badge cc-badge--amber' : 'cc-badge cc-badge--slate'">
                    {{ slotProps.data.session ? 'yes' : 'no' }}
                </span>
            </template>
        </Column>
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

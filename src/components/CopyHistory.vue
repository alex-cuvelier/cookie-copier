<template>
    <div class="history">
        <div class="cc-card history__table-wrap">
            <div class="history__header">
                <span class="cc-label">Copy History</span>
                <span v-if="history.length" class="cc-badge cc-badge--slate">{{ history.length }}</span>
            </div>

            <DataTable
                :value="history"
                v-model:expandedRows="expandedRows"
                :size="'small'"
                scrollable
                scrollHeight="340px"
                sortField="date"
                sortOrder="-1"
            >
                <Column expander style="width: 3rem" />
                <Column field="source" header="Source">
                    <template #body="slotProps">
                        <span class="font-mono" style="font-size: 0.78rem">{{ slotProps.data.source }}</span>
                    </template>
                </Column>
                <Column field="target" header="Target">
                    <template #body="slotProps">
                        <span class="font-mono" style="font-size: 0.78rem">{{ slotProps.data.target }}</span>
                    </template>
                </Column>
                <Column field="date" header="Date">
                    <template #body="slotProps">
                        <span style="font-size: 0.75rem; color: var(--text-secondary)">
                            {{ formatDate(slotProps.data.date) }}
                        </span>
                    </template>
                </Column>
                <Column header="Count">
                    <template #body="slotProps">
                        <span class="cc-badge cc-badge--amber">{{ slotProps.data.cookies.length }}</span>
                    </template>
                </Column>
                <Column header="" frozen alignFrozen="right" style="width: 3.5rem">
                    <template #body="slotProps">
                        <Button
                            rounded
                            outlined
                            icon="pi pi-replay"
                            size="sm"
                            @click="copyHistory(slotProps.data)"
                            class="history__replay-btn"
                            v-tooltip.left="'Rerun this copy'"
                        />
                    </template>
                </Column>
                <template #expansion="slotProps">
                    <div class="history__expansion">
                        <CookiesTable :cookies="slotProps.data.cookies" />
                    </div>
                </template>
                <template #empty>
                    <div class="history__empty">
                        <i class="pi pi-history"></i>
                        <span>No copy history yet</span>
                    </div>
                </template>
            </DataTable>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useHistoryStore } from '@/stores/history';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import CookiesTable from '@/components/CookiesTable.vue';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const { history } = useHistoryStore();
const expandedRows = ref([]);

const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};

const copyHistory = (historyItem) => {
    const promises = historyItem.cookies.map(async (cookie) => {
        console.log('cookie', cookie);
        const cookieQuery = { url: `http${cookie.secure ? 's' : ''}://${cookie.domain}${cookie.path}`, name: cookie.name, partitionKey: cookie.partitionKey };
        console.log('cookieQuery', cookieQuery);
        const actualCookie = await chrome.cookies.get(cookieQuery);

        return chrome.cookies.set({
            url: `http://${historyItem.target}`,
            name: cookie.name,
            value: actualCookie.value,
            domain: historyItem.target,
            path: cookie.path,
            expirationDate: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365
        });
    });

    Promise.all(promises)
        .then(() => {
            toast.add({ severity: 'success', detail: `${historyItem.cookies.length} Cookie(s) copied`, life: 3000 });
        })
        .catch((err) => {
            console.error(err);
            toast.add({ severity: 'error', detail: 'Error copying cookie(s)', life: 3000 });
        });
};
</script>

<style lang="scss" scoped>
.history {
    &__table-wrap {
        padding: 0;
        overflow: hidden;
    }

    &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.65rem 0.85rem;
        border-bottom: 1px solid var(--surface-border);
    }

    &__expansion {
        padding: 0.5rem;
        background: var(--surface-ground);
        border-radius: var(--radius-sm);
    }

    &__replay-btn {
        width: 28px !important;
        height: 28px !important;
    }

    &__empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 2.5rem 1rem;
        color: var(--text-muted);
        font-size: 0.82rem;

        i {
            font-size: 1.5rem;
            opacity: 0.4;
        }
    }
}
</style>

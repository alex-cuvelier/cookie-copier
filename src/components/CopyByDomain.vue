<template>
    <div class="copy-domain stagger-children">
        <!-- Domain Selectors -->
        <div class="copy-domain__selectors">
            <div class="copy-domain__field">
                <span class="cc-label">Source</span>
                <DomainSelector v-model="sourceDomain" inputId="sourceDomain" placeholder="Pick a domain" />
            </div>

            <div class="copy-domain__arrow">
                <i class="pi pi-arrow-right"></i>
            </div>

            <div class="copy-domain__field">
                <span class="cc-label">Target</span>
                <DomainSelector v-model="targetDomain" inputId="targetDomain" placeholder="Pick a domain" />
            </div>
        </div>

        <!-- Cookies Table -->
        <div class="cc-card copy-domain__table-wrap">
            <div class="copy-domain__table-header">
                <span class="cc-label">Available Cookies</span>
                <span v-if="sourceDomainCookies.length" class="cc-badge cc-badge--slate">
                    {{ sourceDomainCookies.length }}
                </span>
            </div>

            <DataTable
                :value="sourceDomainCookies"
                :size="'small'"
                v-model:selection="selectedCookies"
                selectionMode="multiple"
                resizableColumns
                columnResizeMode="expand"
                reorderableColumns
                :metaKeySelection="metaKey"
                scrollable
                scrollHeight="260px"
            >
                <Column field="name" header="Name"></Column>
                <Column field="domain" header="Domain"></Column>
                <Column field="value" header="Value"></Column>
                <Column field="partitionKey.topLevelSite" header="Partition"></Column>
                <template #empty>
                    <div class="copy-domain__empty">
                        <i class="pi pi-inbox"></i>
                        <span v-if="sourceDomain">No cookies for <strong>{{ sourceDomain }}</strong></span>
                        <span v-else>Select a source domain to see cookies</span>
                    </div>
                </template>
            </DataTable>
        </div>

        <!-- Action -->
        <div class="copy-domain__action">
            <Button
                :disabled="!canCopy"
                @click="copyCookies"
                class="cc-btn-glow"
            >
                <i class="pi pi-copy" style="margin-right: 0.4rem"></i>
                Copy {{ selectedCookies.length }} cookie{{ selectedCookies.length !== 1 ? 's' : '' }}
            </Button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { useHistoryStore } from '@/stores/history';
import DomainSelector from '@/components/DomainSelector.vue';

const toast = useToast();
const { pushHistory } = useHistoryStore();

const sourceDomain = ref('');
const targetDomain = ref('');

const selectedCookies = ref([]);
const sourceDomainCookies = ref([]);

const canCopy = computed(() => {
    return sourceDomain.value && targetDomain.value && selectedCookies.value.length;
});

const copyCookies = async () => {
    const promises = selectedCookies.value.map((cookie) => {
        return chrome.cookies.set({
            url: `http://${targetDomain.value}`,
            name: cookie.name,
            value: cookie.value,
            domain: targetDomain.value,
            path: cookie.path,
            expirationDate: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365
        });
    });

    Promise.all(promises)
        .then(() => {
            toast.add({ severity: 'success', detail: `${selectedCookies.value.length} Cookie(s) copied`, life: 3000 });

            pushHistory({
                action: 'copy',
                source: sourceDomain.value,
                target: targetDomain.value,
                cookies: selectedCookies.value,
                date: new Date().toISOString()
            });
        })
        .catch((err) => {
            console.error(err);
            toast.add({ severity: 'error', detail: 'Error copying cookie(s)', life: 3000 });
        });
};

watch(sourceDomain, async (sourceDomain) => {
    const cookies = await chrome.cookies.getAll({ domain: sourceDomain, partitionKey: {} });
    console.log('cookies', cookies);
    sourceDomainCookies.value = cookies;
    selectedCookies.value = [];
});
</script>

<style lang="scss" scoped>
.copy-domain {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;

    &__selectors {
        display: flex;
        align-items: flex-end;
        gap: 0.6rem;
    }

    &__field {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
    }

    &__arrow {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        margin-bottom: 2px;
        color: var(--accent-400);
        opacity: 0.5;
        font-size: 0.75rem;
    }

    &__table-wrap {
        padding: 0;
        overflow: hidden;
    }

    &__table-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.65rem 0.85rem;
        border-bottom: 1px solid var(--surface-border);
    }

    &__empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 2rem 1rem;
        color: var(--text-muted);
        font-size: 0.82rem;

        i {
            font-size: 1.5rem;
            opacity: 0.4;
        }
    }

    &__action {
        display: flex;
        justify-content: flex-end;
    }
}
</style>

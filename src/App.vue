<template>
    <div class="app-shell">
        <div class="app-sticky-top">
            <!-- Header -->
            <header class="app-header">
                <div class="app-header__brand">
                    <img class="app-header__icon" src="/images/icone.png" alt="Cookie Copier" width="40" height="40" />
                    <h1 class="app-header__title">Cookie Copier</h1>
                </div>
                <span class="cc-badge cc-badge--amber">Extension</span>
            </header>

            <!-- Tab Navigation -->
            <nav class="app-tabs">
                <button
                    v-for="(tab, index) in tabs"
                    :key="index"
                    class="app-tabs__btn"
                    :class="{ 'app-tabs__btn--active': activeTab === index }"
                    @click="activeTab = index"
                >
                    <i :class="tab.icon" class="app-tabs__icon"></i>
                    <span>{{ tab.label }}</span>
                </button>
            </nav>
        </div>

        <!-- Content -->
        <main class="app-content animate-fade-in-up" :key="activeTab">
            <CopyByDomain v-if="activeTab === 0" />
            <CopyHistory v-else-if="activeTab === 1" />
            <CookiesEditor v-else-if="activeTab === 2" />
        </main>
    </div>
    <Toast position="bottom-right" />
</template>

<script setup>
import { ref } from 'vue';
import Toast from 'primevue/toast';
import CopyByDomain from '@/components/CopyByDomain.vue';
import CopyHistory from '@/components/CopyHistory.vue';
import CookiesEditor from '@/components/CookiesEditor.vue';

const activeTab = ref(0);

const tabs = [
    { label: 'Copy', icon: 'pi pi-copy' },
    { label: 'History', icon: 'pi pi-history' },
    { label: 'Explore', icon: 'pi pi-search' }
];
</script>

<style lang="scss" scoped>
.app-shell {
    max-width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.app-sticky-top {
    position: sticky;
    top: 0;
    z-index: 10;
}

.app-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.85rem 1.25rem;
    border-bottom: 1px solid var(--surface-border);
    background: var(--surface-card);
    animation: fadeIn 400ms ease-out both;

    &__brand {
        display: flex;
        align-items: center;
        gap: 0.6rem;
    }

    &__icon {
        color: var(--accent-400);
        display: flex;
        align-items: center;
    }

    &__title {
        font-family: var(--font-display);
        font-size: 0.95rem;
        font-weight: 700;
        color: var(--text-primary);
        margin: 0;
        letter-spacing: -0.01em;
    }
}

.app-tabs {
    display: flex;
    gap: 2px;
    padding: 0.5rem 1.25rem;
    background: var(--surface-card);
    border-bottom: 1px solid var(--surface-border);
    animation: fadeIn 400ms ease-out 100ms both;

    &__btn {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.45rem 0.85rem;
        border: none;
        border-radius: 999px;
        background: transparent;
        color: var(--text-muted);
        font-family: var(--font-display);
        font-size: 0.78rem;
        font-weight: 500;
        cursor: pointer;
        transition:
            color var(--transition-fast),
            background var(--transition-fast);

        &:hover {
            color: var(--text-secondary);
            background: var(--surface-hover);
        }

        &--active {
            color: #0f1117;
            background: var(--accent-400);
            box-shadow: 0 2px 8px rgba(251, 191, 36, 0.2);

            .app-tabs__icon {
                opacity: 1;
            }

            &:hover {
                color: #0f1117;
                background: var(--accent-300);
            }
        }
    }

    &__icon {
        font-size: 0.75rem;
        opacity: 0.7;
    }
}

.app-content {
    flex: 1;
    padding: 1rem 1.25rem 1.25rem;
}
</style>

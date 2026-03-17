<template>
    <div class="cookie-form">
        <!-- Value -->
        <div class="cookie-form__field">
            <label class="cc-label" for="value">Value</label>
            <Textarea id="value" v-model="cookieForm.value" placeholder="Value" rows="2" />
        </div>

        <!-- Domain + Path -->
        <div class="cookie-form__row">
            <div class="cookie-form__field cookie-form__field--grow">
                <label class="cc-label" for="domain">Domain</label>
                <InputText id="domain" v-model="cookieForm.domain" placeholder="Domain" />
            </div>
            <div class="cookie-form__field cookie-form__field--grow">
                <label class="cc-label" for="path">Path</label>
                <InputText id="path" v-model="cookieForm.path" placeholder="Path" />
            </div>
        </div>

        <!-- Session + Expiration -->
        <div class="cookie-form__row">
            <div class="cookie-form__field">
                <label class="cc-label" for="session">Session</label>
                <div class="cookie-form__check-row">
                    <Checkbox id="session" v-model="cookieForm.session" binary />
                    <label for="session" class="cookie-form__check-label">Session cookie</label>
                </div>
            </div>
            <div class="cookie-form__field cookie-form__field--grow">
                <label class="cc-label" for="expirationDate">Expiration</label>
                <DatePicker
                    id="calendar-24h"
                    v-model="cookieForm.expirationDate"
                    showTime
                    hourFormat="24"
                    :disabled="cookieForm.session"
                />
            </div>
        </div>

        <!-- Flags -->
        <div class="cookie-form__flags">
            <span class="cc-label">Flags</span>
            <div class="cookie-form__flags-row">
                <div class="cookie-form__flag">
                    <Checkbox id="httpOnly" v-model="cookieForm.httpOnly" binary />
                    <label for="httpOnly">httpOnly</label>
                </div>
                <div class="cookie-form__flag">
                    <Checkbox id="secure" v-model="cookieForm.secure" binary />
                    <label for="secure">secure</label>
                </div>
                <div class="cookie-form__flag">
                    <Checkbox id="hostOnly" v-model="cookieForm.hostOnly" binary />
                    <label for="hostOnly">hostOnly</label>
                </div>
            </div>
        </div>

        <!-- SameSite -->
        <div class="cookie-form__field">
            <label class="cc-label" for="sameSite">SameSite</label>
            <Select
                id="sameSite"
                v-model="cookieForm.sameSite"
                :options="sameSiteOptions"
                optionLabel="name"
                optionValue="value"
            />
        </div>

        <!-- Actions -->
        <div class="cookie-form__actions">
            <Button label="Save" icon="pi pi-check" @click="submitForm" class="cc-btn-glow" />
            <Button label="Delete" icon="pi pi-trash" severity="danger" @click="deleteCookie" />
        </div>
    </div>
</template>

<script setup>
import { ref, watch, defineEmits } from 'vue';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';
import DatePicker from 'primevue/datepicker';
import Button from 'primevue/button';
import Select from 'primevue/select';
import Textarea from 'primevue/textarea';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const props = defineProps({
    cookie: Object
});

const emit = defineEmits(['cookieDeleted']);

const sameSiteOptions = [
    { name: 'None', value: 'no_restriction' },
    { name: 'Lax', value: 'lax' },
    { name: 'Strict', value: 'strict' },
    { name: 'Unspecified', value: 'unspecified' }
];

const cookieForm = ref({
    name: props.cookie.name,
    value: props.cookie.value,
    domain: props.cookie.domain,
    path: props.cookie.path,
    session: props.cookie.session,
    expirationDate: props.cookie.session ? null : new Date(Math.floor(props.cookie.expirationDate * 1000)),
    httpOnly: props.cookie.httpOnly,
    secure: props.cookie.secure,
    sameSite: props.cookie.sameSite,
});

console.log('cookie got', props.cookie);

watch(
    () => cookieForm.value.session,
    (newVal) => {
        if (newVal) {
            cookieForm.value.expirationDate = null;
        } else {
            let dateInOneYear = new Date();
            dateInOneYear.setFullYear(dateInOneYear.getFullYear() + 1);
            cookieForm.value.expirationDate = dateInOneYear;
        }
    }
);

const submitForm = () => {
    let url = "http" + ((cookieForm.value.secure) ? "s" : "") + "://";
    url += cookieForm.value.domain.startsWith('.') ? cookieForm.value.domain.substring(1) : cookieForm.value.domain;
    url += cookieForm.value.path;

    const toSave = {
        name: props.cookie.name,
        value: cookieForm.value.value,
        domain: cookieForm.value.hostOnly ? cookieForm.value.domain : undefined,
        path: cookieForm.value.path,
        httpOnly: cookieForm.value.httpOnly,
        secure: cookieForm.value.secure,
        sameSite: cookieForm.value.sameSite,
        expirationDate: cookieForm.value.expirationDate ? Math.floor(cookieForm.value.expirationDate.getTime() / 1000) : undefined,
        url
    };

    console.log('trying to save ', toSave);

    try {
        chrome.cookies.set(toSave).then((cookie) => {
            console.log('cookie saved', cookie);
            toast.add({ severity: 'success', summary: 'Success', detail: 'Cookie saved', life: 3000 });
        }).catch((err) => {
            console.error(err);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Cookie not saved', life: 3000 });
        });
    } catch (err) {
        console.error(err);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Cookie not saved', life: 3000 });
    }
};

const deleteCookie = () => {
    let url = "http" + ((cookieForm.value.secure) ? "s" : "") + "://";
    url += cookieForm.value.domain.startsWith('.') ? cookieForm.value.domain.substring(1) : cookieForm.value.domain;
    url += cookieForm.value.path;

    chrome.cookies.remove({
        url,
        name: props.cookie.name
    }).then((cookie) => {
        console.log('cookie removed', cookie);
        toast.add({ severity: 'success', summary: 'Success', detail: 'Cookie removed', life: 3000 });
        emit('cookieDeleted');
    }).catch((err) => {
        console.error(err);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Cookie not removed', life: 3000 });
    });
};
</script>

<style lang="scss" scoped>
.cookie-form {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    padding: 0.5rem 0;

    &__field {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;

        &--grow {
            flex: 1;
            min-width: 0;
        }
    }

    &__row {
        display: flex;
        gap: 0.75rem;
    }

    &__check-row {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        height: 2.2rem;
    }

    &__check-label {
        font-size: 0.82rem;
        color: var(--text-secondary);
    }

    &__flags {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
    }

    &__flags-row {
        display: flex;
        gap: 1.2rem;
    }

    &__flag {
        display: flex;
        align-items: center;
        gap: 0.4rem;

        label {
            font-family: var(--font-mono);
            font-size: 0.75rem;
            color: var(--text-secondary);
            cursor: pointer;
        }
    }

    &__actions {
        display: flex;
        gap: 0.5rem;
        padding-top: 0.35rem;
    }
}
</style>

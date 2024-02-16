<template>
    <div>
        <div class="field">
            <label for="value">Value</label>
            <Textarea id="value" v-model="cookieForm.value" placeholder="Value" />
        </div>
        <div class="field">
            <label for="domain">Domain</label>
            <InputText id="domain" v-model="cookieForm.domain" placeholder="Domain" />
        </div>
        <div class="field">
            <label for="path">Path</label>
            <InputText id="path" v-model="cookieForm.path" placeholder="Path" />
        </div>

        <!-- session-->
        <div class="field">
            <label for="session">Session</label>
            <Checkbox id="session" v-model="cookieForm.session" binary="true">Session</Checkbox>
        </div>

        <div class="field">
            <label for="expirationDate">Expiration Date</label>
            <Calendar id="calendar-24h" v-model="cookieForm.expirationDate" showTime hourFormat="24"
                :disabled="cookieForm.session" />
        </div>


        <div class="card flex flex-wrap my-4 gap-3">
            <div class="flex align-items-center">
                <Checkbox id="httpOnly" v-model="cookieForm.httpOnly" binary="true">HTTP Only</Checkbox>
                <label for="httpOnly" class="ml-2">HTTP Only</label>
            </div>
            <div class="flex align-items-center">
                <Checkbox id="secure" v-model="cookieForm.secure" binary="true">Secure</Checkbox>
                <label for="secure" class="ml-2">Secure</label>
            </div>
            <div class="flex align-items-center">
                <Checkbox id="hostOnly" v-model="cookieForm.hostOnly" binary="true">Host Only</Checkbox>
                <label for="hostOnly" class="ml-2">Host Only</label>
            </div>
        </div>

        <div class="field">
            <label for="sameSite">Same Site</label>
            <Dropdown id="sameSite" v-model="cookieForm.sameSite" :options="sameSiteOptions" optionLabel="name"
                optionValue="value" />
        </div>

        <Button label="Submit" @click="submitForm" />
        <Button label="Delete" severity="danger" class="ml-2" @click="deleteCookie" />
    </div>
</template>

<script setup>
import { ref, watch, defineEmits } from 'vue';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';
import Calendar from 'primevue/calendar';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
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
    { name: 'Unspecified', value: 'unspecified' }];

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
            toast.add({ severity: 'success', summary: 'Success', detail: 'Cookie saved' });
        }).catch((err) => {
            console.error(err);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Cookie not saved' });
        });
    } catch (err) {
        console.error(err);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Cookie not saved' });
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
        toast.add({ severity: 'success', summary: 'Success', detail: 'Cookie removed' });
        emit('cookieDeleted') ;

    }).catch((err) => {
        console.error(err);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Cookie not removed' });
    });
};
</script>

<style lang="scss" scoped>
.field {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
}
</style>
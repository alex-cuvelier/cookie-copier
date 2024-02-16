<template>
    <div>
        <div class="field">
            <label for="name">Name</label>
            <InputText id="name" v-model="cookieForm.name" placeholder="Name" />
        </div>
        <div class="field">
            <label for="value">Value</label>
            <InputText id="value" v-model="cookieForm.value" placeholder="Value" />
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
        </div>

        <div class="field">
            <label for="sameSite">Same Site</label>
            <Dropdown id="sameSite" v-model="cookieForm.sameSite" :options="sameSiteOptions" optionLabel="name"
                optionValue="value" />
        </div>

        <Button label="Submit" @click="submitForm" />
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';
import Calendar from 'primevue/calendar';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const props = defineProps({
    cookie: Object
});

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
console.log(props.cookie);

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
function cookieForCreationFromFullCookie(fullCookie) {
    var newCookie = {};
    //If no real url is available use: "https://" : "http://" + domain + path
    newCookie.url = "http" + ((fullCookie.secure) ? "s" : "") + "://" + fullCookie.domain + fullCookie.path;
    newCookie.name = fullCookie.name;
    newCookie.value = fullCookie.value;
    if (!fullCookie.hostOnly)
        newCookie.domain = fullCookie.domain;
    newCookie.path = fullCookie.path;
    newCookie.secure = fullCookie.secure;
    newCookie.httpOnly = fullCookie.httpOnly;
    if (!fullCookie.session)
        newCookie.expirationDate = fullCookie.expirationDate;
    newCookie.storeId = fullCookie.storeId;
    return newCookie;
}

const submitForm = () => {
    const toSave = {
        name: props.cookie.name,
        value: props.cookie.value,
        domain: props.cookie.domain,
        path: props.cookie.path,
        httpOnly: props.cookie.httpOnly,
        secure: props.cookie.secure,
        sameSite: props.cookie.sameSite,
        expirationDate: cookieForm.value.expirationDate ? Math.floor(cookieForm.value.expirationDate.getTime() / 1000) : undefined,
        url: `http://${props.cookie.domain}`    
    };





    try {
        chrome.cookies.set(toSave)
        toast.add({ severity: 'success', summary: 'Success', detail: 'Cookie saved' });
    } catch (err) {
        console.error(err);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Cookie not saved' });
    }
};
</script>

<style lang="scss" scoped>
.field {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
}
</style>
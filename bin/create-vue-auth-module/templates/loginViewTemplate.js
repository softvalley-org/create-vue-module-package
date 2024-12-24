export default `
<script setup>
import { useAuthStore } from '././stores'
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router       = useRouter()
const auth         = useAuthStore();
const phoneNumber  = ref('');
const password     = ref('');
const errorMessage = ref('');

const submit = async() =>{
    const res = await auth.login({
        phone_number : phoneNumber.value,
        password     : password.value
    });
    if(res?.success){
        router.push({name:'dashboard'});
    }else{
        errorMessage.value = res?.message;
    }
}

</script>

<template>
    <div>
        // Design and setup Login Page
    </div>

</template>


<style scoped>

</style>

`;
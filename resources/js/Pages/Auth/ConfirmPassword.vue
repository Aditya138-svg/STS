<script setup>
import AuthLayout from '@/Layouts/AuthLayout.vue'
import { Head, useForm } from '@inertiajs/vue3'
import { useGuestAssets } from '@/composables/Guest'
import { ref } from 'vue'

const { route } = useGuestAssets()
const showPassword = ref(false)

const form = useForm({
    password: '',
})

function submit() {
    form.post(route('password.confirm.store'), {
        onFinish: () => form.reset(),
    })
}
</script>

<template>
    <AuthLayout>
        <Head title="Confirm Password" />

        <h1 class="auth-title">Confirm password</h1>
        <p class="small text-muted mb-4">Please confirm your password to continue.</p>

        <form @submit.prevent="submit">
            <div class="form-group">
                <label class="form-label" for="password">Password</label>
                <div class="auth-input-group password-group">
                    <input 
                        id="password" 
                        v-model="form.password" 
                        :type="showPassword ? 'text' : 'password'" 
                        class="form-control" 
                        required 
                        autocomplete="current-password"
                        placeholder="Enter your password"
                    >
                    <i class="fas fa-lock input-icon"></i>
                    <button 
                        type="button" 
                        class="eye-button" 
                        @click="showPassword = !showPassword"
                        :title="showPassword ? 'Hide password' : 'Show password'"
                    >
                        <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                </div>
                <div v-if="form.errors.password" class="text-danger small mt-1">{{ form.errors.password }}</div>
            </div>

            <button type="submit" class="btn-auth" :disabled="form.processing">
                Confirm
            </button>
        </form>
    </AuthLayout>
</template>

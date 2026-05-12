<script setup>
import AuthLayout from '@/Layouts/AuthLayout.vue'
import { Head, useForm } from '@inertiajs/vue3'
import { useGuestAssets } from '@/composables/Guest'
import { ref } from 'vue'

const props = defineProps({
    token: { type: String, required: true },
    email: { type: String, required: true },
})

const { route } = useGuestAssets()
const showPassword = ref(false)
const showPasswordConfirmation = ref(false)

const form = useForm({
    token: props.token,
    email: props.email,
    password: '',
    password_confirmation: '',
})

function submit() {
    form.post(route('password.update'), {
        onFinish: () => form.reset('password', 'password_confirmation'),
    })
}
</script>

<template>
    <AuthLayout authImage="forgot-password.svg">
        <Head title="Reset Password" />

        <h1 class="auth-title">New password</h1>

        <form @submit.prevent="submit">
            <div class="form-group">
                <label class="form-label" for="email">Email</label>
                <div class="auth-input-group">
                    <input 
                        id="email" 
                        v-model="form.email" 
                        type="email" 
                        class="form-control" 
                        required 
                        autocomplete="username"
                    >
                    <i class="fas fa-envelope input-icon"></i>
                </div>
                <div v-if="form.errors.email" class="text-danger small mt-1">{{ form.errors.email }}</div>
            </div>

            <div class="form-group">
                <label class="form-label" for="password">Password</label>
                <div class="auth-input-group password-group">
                    <input
                        id="password"
                        v-model="form.password"
                        :type="showPassword ? 'text' : 'password'"
                        class="form-control"
                        required
                        autocomplete="new-password"
                        placeholder="New password"
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

            <div class="form-group">
                <label class="form-label" for="password_confirmation">Confirm Password</label>
                <div class="auth-input-group password-group">
                    <input
                        id="password_confirmation"
                        v-model="form.password_confirmation"
                        :type="showPasswordConfirmation ? 'text' : 'password'"
                        class="form-control"
                        required
                        autocomplete="new-password"
                        placeholder="Confirm new password"
                    >
                    <i class="fas fa-lock input-icon"></i>
                    <button 
                        type="button" 
                        class="eye-button" 
                        @click="showPasswordConfirmation = !showPasswordConfirmation"
                        :title="showPasswordConfirmation ? 'Hide password' : 'Show password'"
                    >
                        <i :class="showPasswordConfirmation ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                </div>
            </div>

            <button type="submit" class="btn-auth" :disabled="form.processing">
                Reset password
            </button>
        </form>
    </AuthLayout>
</template>

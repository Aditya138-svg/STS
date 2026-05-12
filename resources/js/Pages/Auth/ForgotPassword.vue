<script setup>
import AuthLayout from '@/Layouts/AuthLayout.vue'
import { Head, Link, useForm } from '@inertiajs/vue3'
import { useGuestAssets } from '@/composables/Guest'

defineProps({
    status: { type: String, default: null },
})

const { route } = useGuestAssets()

const form = useForm({
    email: '',
})

function submit() {
    form.post(route('password.email'))
}
</script>

<template>
    <AuthLayout authImage="forgot-password.svg">
        <Head title="Forgot Password" />

        <h1 class="auth-title">Reset password</h1>
        <p class="small text-muted mb-4">We will email you a password reset link.</p>

        <div v-if="status" class="alert alert-success small py-2 mb-4">
            {{ status }}
        </div>

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
                        placeholder="Enter your email"
                    >
                    <i class="fas fa-envelope input-icon"></i>
                </div>
                <div v-if="form.errors.email" class="text-danger small mt-1">{{ form.errors.email }}</div>
            </div>

            <button type="submit" class="btn-auth" :disabled="form.processing">
                {{ form.processing ? 'Sending...' : 'Email password reset link' }}
            </button>
        </form>

        <div class="auth-footer">
            Remembered your password? <Link :href="route('login')">Sign in</Link>
        </div>
    </AuthLayout>
</template>

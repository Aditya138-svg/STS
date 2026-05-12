<script setup>
import AuthLayout from '@/Layouts/AuthLayout.vue'
import { Head, Link, useForm } from '@inertiajs/vue3'
import { useGuestAssets } from '@/composables/Guest'
import { ref } from 'vue'

defineProps({
    canResetPassword: { type: Boolean, default: false },
    status: { type: String, default: null },
})

const { route } = useGuestAssets()
const showPassword = ref(false)

const form = useForm({
    email: '',
    password: '',
    remember: false,
})

function submit() {
    form.post(route('login'), {
        onFinish: () => form.reset('password'),
    })
}
</script>

<template>
    <AuthLayout>
        <Head title="Login" />

        <h1 class="auth-title">Login</h1>

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
                        placeholder="driver@sts-transport.com"
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
                        autocomplete="current-password"
                        placeholder="••••••••"
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

            <div class="form-options">
                <label class="remember-me">
                    <input id="remember" v-model="form.remember" type="checkbox">
                    <span>Remember me</span>
                </label>
                <Link v-if="canResetPassword" :href="route('password.request')" class="forgot-password">
                    Forgot Password?
                </Link>
            </div>

            <button type="submit" class="btn-auth" :disabled="form.processing">
                {{ form.processing ? 'Logging in...' : 'Login' }}
            </button>
        </form>

        <div class="auth-footer">
            Don’t have an account? <Link :href="route('register')">Sign up</Link>
        </div>
    </AuthLayout>
</template>

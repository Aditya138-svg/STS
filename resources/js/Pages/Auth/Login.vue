<script setup>
import AuthLayout from '@/Layouts/AuthLayout.vue'
import { Head, Link, useForm } from '@inertiajs/vue3'
import { useGuestAssets } from '@/composables/Guest'

defineProps({
    canResetPassword: { type: Boolean, default: false },
    status: { type: String, default: null },
})

const { route } = useGuestAssets()

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

        <div class="card shadow border-0 rounded-4 overflow-hidden">
            <div class="card-body p-4 p-lg-5">
                <h1 class="h4 mb-1 fw-semibold">Welcome back</h1>
                <p class="text-muted small mb-4">Sign in to continue to your dashboard.</p>

                <div v-if="status" class="alert alert-success small py-2">
                    {{ status }}
                </div>

                <form @submit.prevent="submit">
                    <div class="mb-3">
                        <label class="form-label small" for="email">Email</label>
                        <input id="email" v-model="form.email" type="email" class="form-control" required autocomplete="username" placeholder="name@example.com">
                        <div v-if="form.errors.email" class="text-danger small mt-1">{{ form.errors.email }}</div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label small" for="password">Password</label>
                        <input
                            id="password"
                            v-model="form.password"
                            type="password"
                            class="form-control"
                            required
                            autocomplete="current-password"
                            placeholder="Enter your password"
                        >
                        <div v-if="form.errors.password" class="text-danger small mt-1">{{ form.errors.password }}</div>
                    </div>

                    <div class="form-check mb-3">
                        <input id="remember" v-model="form.remember" class="form-check-input" type="checkbox">
                        <label class="form-check-label small" for="remember">Remember me</label>
                    </div>

                    <button type="submit" class="btn btn-success w-100 py-2 fw-semibold" :disabled="form.processing">
                        {{ form.processing ? 'Signing in...' : 'Login' }}
                    </button>
                </form>

                <div class="d-flex justify-content-between align-items-center mt-3 small">
                    <Link v-if="canResetPassword" :href="route('password.request')" class="link-secondary">Forgot password?</Link>
                    <Link :href="route('register')" class="link-secondary">Create account</Link>
                </div>
            </div>
        </div>
    </AuthLayout>
</template>

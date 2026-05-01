<script setup>
import AuthLayout from '@/Layouts/AuthLayout.vue'
import { Head, Link, useForm } from '@inertiajs/vue3'
import { useGuestAssets } from '@/composables/Guest'

const { route } = useGuestAssets()

const form = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
})

function submit() {
    form.post(route('register'), {
        onFinish: () => form.reset('password', 'password_confirmation'),
    })
}
</script>

<template>
    <AuthLayout>
        <Head title="Register" />

        <div class="card shadow border-0 rounded-4 overflow-hidden">
            <div class="card-body p-4 p-lg-5">
                <h1 class="h4 mb-1 fw-semibold">Create account</h1>
                <p class="text-muted small mb-4">Set up your account to access the admin dashboard.</p>

                <form @submit.prevent="submit">
                    <div class="mb-3">
                        <label class="form-label small" for="name">Name</label>
                        <input id="name" v-model="form.name" type="text" class="form-control" required autocomplete="name" placeholder="Your full name">
                        <div v-if="form.errors.name" class="text-danger small mt-1">{{ form.errors.name }}</div>
                    </div>

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
                            autocomplete="new-password"
                            placeholder="Create password"
                        >
                        <div v-if="form.errors.password" class="text-danger small mt-1">{{ form.errors.password }}</div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label small" for="password_confirmation">Confirm password</label>
                        <input
                            id="password_confirmation"
                            v-model="form.password_confirmation"
                            type="password"
                            class="form-control"
                            required
                            autocomplete="new-password"
                            placeholder="Confirm password"
                        >
                    </div>

                    <button type="submit" class="btn btn-success w-100 py-2 fw-semibold" :disabled="form.processing">
                        {{ form.processing ? 'Creating account...' : 'Create account' }}
                    </button>
                </form>

                <p class="small text-muted mt-3 mb-0">
                    Already registered?
                    <Link :href="route('login')" class="link-secondary">Sign in</Link>
                </p>
            </div>
        </div>
    </AuthLayout>
</template>

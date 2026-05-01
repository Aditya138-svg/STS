<script setup>
import AuthLayout from '@/Layouts/AuthLayout.vue'
import { Head, useForm } from '@inertiajs/vue3'
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
    <AuthLayout>
        <Head title="Forgot password" />

        <div class="card shadow-sm border-0">
            <div class="card-body p-4">
                <h1 class="h4 mb-3">Reset password</h1>
                <p class="small text-muted">We will email you a reset link.</p>

                <div v-if="status" class="alert alert-success small py-2">{{ status }}</div>

                <form @submit.prevent="submit">
                    <div class="mb-3">
                        <label class="form-label small" for="email">Email</label>
                        <input id="email" v-model="form.email" type="email" class="form-control form-control-sm" required autocomplete="username">
                        <div v-if="form.errors.email" class="text-danger small mt-1">{{ form.errors.email }}</div>
                    </div>
                    <button type="submit" class="btn btn-primary w-100" :disabled="form.processing">Email link</button>
                </form>
            </div>
        </div>
    </AuthLayout>
</template>

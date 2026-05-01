<script setup>
import AuthLayout from '@/Layouts/AuthLayout.vue'
import { Head, useForm } from '@inertiajs/vue3'
import { useGuestAssets } from '@/composables/Guest'

const props = defineProps({
    token: { type: String, required: true },
    email: { type: String, required: true },
})

const { route } = useGuestAssets()

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
    <AuthLayout>
        <Head title="Set new password" />

        <div class="card shadow-sm border-0">
            <div class="card-body p-4">
                <h1 class="h4 mb-4">Choose a new password</h1>

                <form @submit.prevent="submit">
                    <div class="mb-3">
                        <label class="form-label small" for="email">Email</label>
                        <input id="email" v-model="form.email" type="email" class="form-control form-control-sm" required autocomplete="username">
                        <div v-if="form.errors.email" class="text-danger small mt-1">{{ form.errors.email }}</div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label small" for="password">Password</label>
                        <input
                            id="password"
                            v-model="form.password"
                            type="password"
                            class="form-control form-control-sm"
                            required
                            autocomplete="new-password"
                        >
                        <div v-if="form.errors.password" class="text-danger small mt-1">{{ form.errors.password }}</div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label small" for="password_confirmation">Confirm password</label>
                        <input
                            id="password_confirmation"
                            v-model="form.password_confirmation"
                            type="password"
                            class="form-control form-control-sm"
                            required
                            autocomplete="new-password"
                        >
                    </div>

                    <button type="submit" class="btn btn-primary w-100" :disabled="form.processing">Update password</button>
                </form>
            </div>
        </div>
    </AuthLayout>
</template>

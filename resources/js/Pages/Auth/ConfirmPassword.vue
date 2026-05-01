<script setup>
import AuthLayout from '@/Layouts/AuthLayout.vue'
import { Head, useForm } from '@inertiajs/vue3'
import { useGuestAssets } from '@/composables/Guest'

const { route } = useGuestAssets()

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
        <Head title="Confirm password" />

        <div class="card shadow-sm border-0">
            <div class="card-body p-4">
                <h1 class="h4 mb-3">Confirm password</h1>
                <p class="small text-muted">Please enter your password to continue.</p>

                <form @submit.prevent="submit">
                    <div class="mb-3">
                        <label class="form-label small" for="password">Password</label>
                        <input id="password" v-model="form.password" type="password" class="form-control form-control-sm" required autocomplete="current-password">
                        <div v-if="form.errors.password" class="text-danger small mt-1">{{ form.errors.password }}</div>
                    </div>
                    <button type="submit" class="btn btn-primary w-100" :disabled="form.processing">Confirm</button>
                </form>
            </div>
        </div>
    </AuthLayout>
</template>

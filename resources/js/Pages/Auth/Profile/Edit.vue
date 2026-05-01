<script setup>
import { computed } from 'vue'
import GuestLayout from '@/Layouts/GuestLayout.vue'
import { Head, Link, useForm, usePage } from '@inertiajs/vue3'
import { useGuestAssets } from '@/composables/Guest'

const page = usePage()
const { route } = useGuestAssets()

const user = computed(() => page.props.auth?.user)

const profileForm = useForm({
    name: user.value?.name ?? '',
    email: user.value?.email ?? '',
})

const passwordForm = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
})

function submitProfile() {
    profileForm.put(route('user-profile-information.update'))
}

function submitPassword() {
    passwordForm.put(route('user-password.update'), {
        preserveScroll: true,
        onSuccess: () => passwordForm.reset(),
    })
}
</script>

<template>
    <GuestLayout>
        <Head title="Edit profile" />

        <div class="container py-5" style="max-width: 560px">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h1 class="h4 mb-0">Profile</h1>
                <Link :href="route('dashboard')" class="btn btn-outline-secondary btn-sm">Dashboard</Link>
            </div>

            <div class="card shadow-sm border-0 mb-4">
                <div class="card-body p-4">
                    <h2 class="h6 text-muted mb-3">Contact details</h2>
                    <form @submit.prevent="submitProfile">
                        <div class="mb-3">
                            <label class="form-label small" for="name">Name</label>
                            <input id="name" v-model="profileForm.name" type="text" class="form-control form-control-sm" required autocomplete="name">
                            <div v-if="profileForm.errors.name" class="text-danger small mt-1">{{ profileForm.errors.name }}</div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small" for="email">Email</label>
                            <input id="email" v-model="profileForm.email" type="email" class="form-control form-control-sm" required autocomplete="username">
                            <div v-if="profileForm.errors.email" class="text-danger small mt-1">{{ profileForm.errors.email }}</div>
                        </div>
                        <button type="submit" class="btn btn-primary btn-sm" :disabled="profileForm.processing">Save</button>
                    </form>
                </div>
            </div>

            <div class="card shadow-sm border-0">
                <div class="card-body p-4">
                    <h2 class="h6 text-muted mb-3">Change password</h2>
                    <form @submit.prevent="submitPassword">
                        <div class="mb-3">
                            <label class="form-label small" for="current_password">Current password</label>
                            <input id="current_password" v-model="passwordForm.current_password" type="password" class="form-control form-control-sm" autocomplete="current-password">
                            <div v-if="passwordForm.errors.current_password" class="text-danger small mt-1">{{ passwordForm.errors.current_password }}</div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small" for="new_password">New password</label>
                            <input id="new_password" v-model="passwordForm.password" type="password" class="form-control form-control-sm" autocomplete="new-password">
                            <div v-if="passwordForm.errors.password" class="text-danger small mt-1">{{ passwordForm.errors.password }}</div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small" for="new_password_confirmation">Confirm new password</label>
                            <input id="new_password_confirmation" v-model="passwordForm.password_confirmation" type="password" class="form-control form-control-sm" autocomplete="new-password">
                        </div>
                        <button type="submit" class="btn btn-outline-primary btn-sm" :disabled="passwordForm.processing">Update password</button>
                    </form>
                </div>
            </div>
        </div>
    </GuestLayout>
</template>

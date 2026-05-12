<script setup>
import AuthLayout from '@/Layouts/AuthLayout.vue'
import { Head, Link, useForm } from '@inertiajs/vue3'
import { useGuestAssets } from '@/composables/Guest'
import { ref } from 'vue'

const { route } = useGuestAssets()
const showPassword = ref(false)
const showPasswordConfirmation = ref(false)

const form = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    opt_in: [],
})

function submit() {
    form.post(route('register'), {
        onFinish: () => form.reset('password', 'password_confirmation'),
    })
}
</script>

<template>
    <AuthLayout authImage="register.svg">
        <Head title="Register" />

        <h1 class="auth-title">Register</h1>

        <form @submit.prevent="submit">
            <div class="form-group">
                <label class="form-label" for="name">Name</label>
                <div class="auth-input-group">
                    <input id="name" v-model="form.name" type="text" class="form-control" required autocomplete="name" placeholder="Your full name">
                    <i class="fas fa-user input-icon"></i>
                </div>
                <div v-if="form.errors.name" class="text-danger small mt-1">{{ form.errors.name }}</div>
            </div>

            <div class="form-group">
                <label class="form-label" for="email">Email</label>
                <div class="auth-input-group">
                    <input id="email" v-model="form.email" type="email" class="form-control" required autocomplete="username" placeholder="name@example.com">
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
                        placeholder="Create password"
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
                        placeholder="Confirm password"
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

            <div class="form-group">
                <label class="checkbox-label">
                    <input type="checkbox" id="opt_in_privacy" value="privacy" v-model="form.opt_in" required>
                    <span>
                        I have read and agree to the 
                        <Link :href="route('privacy')" class="legal-link">privacy policy</Link> 
                        and 
                        <Link :href="route('terms')" class="legal-link">terms & conditions</Link>.
                    </span>
                </label>
                <div v-if="form.errors['opt_in.0']" class="text-danger small mt-1">{{ form.errors['opt_in.0'] }}</div>
            </div>

            <div class="form-group">
                <label class="checkbox-label">
                    <input type="checkbox" id="opt_in_notifications" value="notifications" v-model="form.opt_in">
                    <span>I agree to receive notifications regarding delivery and other updates via email or SMS. Data rates may apply (for SMS)</span>
                </label>
                <div v-if="form.errors['opt_in.1']" class="text-danger small mt-1">{{ form.errors['opt_in.1'] }}</div>
            </div>

            <button type="submit" class="btn-auth" :disabled="form.processing">
                {{ form.processing ? 'Creating account...' : 'Create account' }}
            </button>
        </form>

        <div class="auth-footer">
            Already registered? <Link :href="route('login')">Sign in</Link>
        </div>
    </AuthLayout>
</template>

<script setup>
import { computed } from 'vue'
import { Head, Link } from '@inertiajs/vue3'
import { useAdminAssets } from '@/Composables/Admin'

const props = defineProps({
    mode: { type: String, default: 'create' },
    user: { type: Object, default: null },
})

const { href } = useAdminAssets()

const title = computed(() => {
    if (props.mode === 'view') return 'View User'
    if (props.mode === 'edit') return 'Edit User'
    return 'Create User'
})
</script>

<template>
    <Head :title="title" />
    <div class="container-fluid dash">
        <div class="dashboarddiv">
            <div class="box">
                <div class="box-header">
                    <h3 class="box-title">{{ title }}</h3>
                    <div class="btn-toolbar pull-right">
                        <Link :href="href('admin/admin-section/users/user')" class="btn btn-default">
                            <i class="fa fa-arrow-left"></i> Back to list
                        </Link>
                    </div>
                </div>
                <div class="box-body">
                    <template v-if="mode === 'create'">
                        <p class="text-muted">
                            Replace this stub with your registration form or legacy “user account” fields wired to a save action.
                        </p>
                    </template>
                    <template v-else-if="user">
                        <dl class="dl-horizontal user-account-summary">
                            <dt>ID</dt>
                            <dd>{{ user.id }}</dd>
                            <dt>Name</dt>
                            <dd>{{ user.name }}</dd>
                            <dt>Email</dt>
                            <dd>{{ user.email }}</dd>
                        </dl>
                        <p v-if="mode === 'edit'" class="text-muted">
                            Wire this page to your update action when the account form is ready.
                        </p>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.user-account-summary dt {
    font-weight: 600;
}
</style>

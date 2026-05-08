<script setup>
import { ref, computed } from 'vue'
import { Head, Link, router, usePage } from '@inertiajs/vue3'
import { useAdminAssets } from '@/Composables/Admin'

const props = defineProps({
    groups: {
        type: Array,
        default: () => []
    },
    statusOptions: {
        type: Array,
        default: () => ['Active', 'In-Active']
    }
})

const page = usePage()
const { href, route } = useAdminAssets()

const selectedRows = ref([])
const selectAll = ref(false)
const statusFilter = ref('')
const isActionsOpen = ref(false)

// Modal state
const showUsersModal = ref(false)
const modalGroupName = ref('')
const modalGroupUsers = ref([])
const isLoadingUsers = ref(false)

const toggleSelectAll = () => {
    if (selectAll.value) {
        selectedRows.value = props.groups.map(g => g.id)
    } else {
        selectedRows.value = []
    }
}

const toggleActions = () => {
    isActionsOpen.value = !isActionsOpen.value
}

const showGroupUsers = async (group) => {
    modalGroupName.value = group.group_name
    showUsersModal.value = true
    isLoadingUsers.value = true
    modalGroupUsers.value = []

    try {
        // In a real scenario, this would be an AJAX call
        // For now, we assume users might be part of the group object or fetched
        const response = await fetch(`${href('admin/admin-section/users/group/get-users')}?id=${group.id}`)
        const data = await response.json()
        if (data.status) {
            modalGroupUsers.value = data.data
        }
    } catch (error) {
        console.error('Error fetching group users:', error)
        // Fallback or error handling
    } finally {
        isLoadingUsers.value = false
    }
}

const deleteSelected = () => {
    if (selectedRows.value.length === 0) {
        alert('Please select at least 1 Group.')
        return
    }

    if (confirm('Are you sure you want to delete selected groups?')) {
        router.post(route('admin.admin_section.users.group.bulk_delete'), {
            ids: selectedRows.value
        }, {
            onSuccess: () => {
                selectedRows.value = []
                selectAll.value = false
            }
        })
    }
}

const getStatusBadgeClass = (status) => {
    const s = String(status).toLowerCase()
    return s === 'active' || s === '1' ? 'badge-success' : 'badge-danger'
}

const getStatusLabel = (status) => {
    const s = String(status).toLowerCase()
    return s === 'active' || s === '1' ? 'Active' : 'In-Active'
}
</script>

<template>
    <Head title="Groups" />

    <div class="container-fluid dash">
        <div class="dashboarddiv">
            <div class="box">
                <div class="box-header-flex">
                    <h3 class="box-title">Groups Management</h3>
                    <div class="header-actions">
                        <div class="btn-group" :class="{ open: isActionsOpen }">
                            <button type="button" class="btn btn-primary dropdown-toggle" @click="toggleActions">
                                <i class="fa fa-bolt"></i> Actions <span class="caret ms-2"></span>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-right" role="menu">
                                <li>
                                    <Link :href="href('admin/admin-section/users/group/create')">
                                        <i class="fa fa-plus"></i> Create New
                                    </Link>
                                </li>
                                <li class="divider"></li>
                                <li>
                                    <a href="#" class="text-danger" @click.prevent="deleteSelected">
                                        <i class="fa fa-trash"></i> Delete Selected
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="box-body">
                    <!-- Flash Messages -->
                    <div v-if="page.props.flash?.success" class="alert alert-success alert-dismissible show mb-20">
                        <button type="button" class="close" @click="page.props.flash.success = null">&times;</button>
                        <i class="icon fa fa-check"></i> {{ page.props.flash.success }}
                    </div>

                    <div class="sts-table-filter-shell mb-20">
                        <div class="sts-filter-group">
                            <span class="sts-filter-label">Status</span>
                            <select v-model="statusFilter" class="sts-input-sm">
                                <option value="">-All-</option>
                                <option v-for="opt in statusOptions" :key="opt" :value="opt">{{ opt }}</option>
                            </select>
                        </div>
                    </div>

                    <div class="sts-table-card">
                        <div class="sts-table-responsive">
                            <table class="sts-table">
                                <thead>
                                    <tr>
                                        <th class="text-center checkbox-col">
                                            <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" class="row-checkbox">
                                        </th>
                                        <th>Group Name</th>
                                        <th>Users</th>
                                        <th>Created on</th>
                                        <th>Status</th>
                                        <th class="text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="group in groups" :key="group.id" class="group-row">
                                        <td class="text-center checkbox-col">
                                            <input type="checkbox" v-model="selectedRows" :value="group.id" class="row-checkbox">
                                        </td>
                                        <td><strong>{{ group.group_name }}</strong></td>
                                        <td>
                                            <button type="button" class="btn btn-link btn-xs show-users-link" @click="showGroupUsers(group)">
                                                <i class="fa fa-users me-1"></i> View Users
                                            </button>
                                        </td>
                                        <td>{{ group.created_at_formatted || group.created_at }}</td>
                                        <td>
                                            <span class="sts-badge" :class="getStatusBadgeClass(group.active)">
                                                {{ getStatusLabel(group.active) }}
                                            </span>
                                        </td>
                                        <td class="text-center">
                                            <div class="action-btns">
                                                <Link :href="href(`admin/admin-section/users/group/${group.id}/edit`)" class="btn btn-default btn-xs" title="Edit">
                                                    <i class="fa fa-pencil"></i>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr v-if="groups.length === 0">
                                        <td colspan="6" class="sts-table-empty">
                                            <i class="fa fa-users sts-empty-icon"></i>
                                            <span class="sts-empty-text">No groups found</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Users Modal -->
    <div v-if="showUsersModal" class="sts-modal-overlay" @click.self="showUsersModal = false">
        <div class="sts-modal-dialog">
            <div class="sts-modal-content">
                <div class="sts-modal-header bg-info">
                    <h5 class="modal-title">Users in Group: {{ modalGroupName }}</h5>
                    <button type="button" class="close-btn" @click="showUsersModal = false">&times;</button>
                </div>
                <div class="sts-modal-body">
                    <div v-if="isLoadingUsers" class="text-center p-20">
                        <i class="fa fa-spinner fa-spin fa-2x text-muted"></i>
                        <p class="mt-10">Loading users...</p>
                    </div>
                    <div v-else-if="modalGroupUsers.length > 0" class="user-pill-container">
                        <span v-for="user in modalGroupUsers" :key="user.id" class="user-pill">
                            <i class="fa fa-user me-1"></i> {{ user.full_name || user.name }}
                        </span>
                    </div>
                    <div v-else class="text-center p-20 text-muted">
                        No users found in this group.
                    </div>
                </div>
                <div class="sts-modal-footer">
                    <button type="button" class="btn btn-default" @click="showUsersModal = false">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.box-header-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #edf2f7;
}

.box-title {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: #1a202c;
}

.header-actions .btn-primary {
    background-color: #11635a !important;
    border-color: #0d5249 !important;
    font-weight: 600;
    border-radius: 6px;
}

.sts-table-filter-shell {
    background: #f8fafc;
    padding: 15px;
    border-radius: 8px;
    border: 1px solid #edf2f7;
}

.sts-filter-group {
    display: flex;
    align-items: center;
    gap: 10px;
}

.sts-filter-label {
    font-weight: 600;
    font-size: 13px;
    color: #4a5568;
}

.sts-input-sm {
    height: 32px;
    padding: 0 10px;
    border: 1px solid #cbd5e0;
    border-radius: 6px;
    font-size: 13px;
}

.show-users-link {
    color: #308e87;
    font-weight: 600;
    text-decoration: none;
}

.show-users-link:hover {
    text-decoration: underline;
}

/* Modal Styles */
.sts-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1050;
    backdrop-filter: blur(4px);
}

.sts-modal-dialog {
    width: 100%;
    max-width: 500px;
    margin: 20px;
}

.sts-modal-content {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.sts-modal-header {
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
}

.bg-info { background-color: #308e87; }

.modal-title {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
}

.close-btn {
    background: none;
    border: none;
    color: #fff;
    font-size: 24px;
    cursor: pointer;
}

.sts-modal-body {
    padding: 20px;
    min-height: 100px;
}

.user-pill-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.user-pill {
    background: #f0fdf4;
    color: #166534;
    border: 1px solid #bbf7d0;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
}

.sts-modal-footer {
    padding: 15px 20px;
    border-top: 1px solid #edf2f7;
    text-right: right;
    display: flex;
    justify-content: flex-end;
}

.sts-table-card {
    background: #fff;
    border-radius: 12px;
    border: 1px solid #edf2f7;
    overflow: hidden;
}

.sts-table {
    width: 100%;
    border-collapse: collapse;
}

.sts-table th {
    background: #f8fafc;
    padding: 12px 15px;
    text-align: left;
    font-size: 12px;
    font-weight: 700;
    color: #4a5568;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 2px solid #edf2f7;
}

.sts-table td {
    padding: 12px 15px;
    border-bottom: 1px solid #edf2f7;
    font-size: 14px;
    color: #2d3748;
}

.sts-badge {
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
}

.badge-success { background: #dcfce7; color: #166534; }
.badge-danger { background: #fee2e2; color: #991b1b; }

.sts-empty-icon {
    font-size: 48px;
    color: #cbd5e0;
    display: block;
    margin-bottom: 10px;
}

.sts-table-empty {
    text-align: center;
    padding: 40px;
}
</style>

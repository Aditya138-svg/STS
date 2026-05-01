<script setup>
import { ref, computed, watch } from 'vue'
import { Head, useForm, router, usePage } from '@inertiajs/vue3'

const props = defineProps({
    zipcodes: Object,
    filters: Object,
    areas: Array,
    locations: Array,
    tiers: Array,
})

const page = usePage()

// State for modals
const showZipcodeModal = ref(false)
const showLocationModal = ref(false)
const isEditing = ref(false)

// State for filters
const filterSearch = ref(props.filters.search_val || '')
const filterArea = ref(props.filters.filter_by_area || '')
const filterDay = ref(props.filters.filter_by_day || '')

const applyFilters = () => {
    router.get(route('dispatch_scheduling.zipcode_management.index'), {
        search_val: filterSearch.value,
        filter_by_area: filterArea.value,
        filter_by_day: filterDay.value,
    }, { preserveState: true })
}

// Zipcode Form
const zipForm = useForm({
    z_id: 0,
    zipcode: '',
    area: '',
})

const openAddZipcode = () => {
    isEditing.value = false
    zipForm.reset()
    zipForm.z_id = 0
    showZipcodeModal.value = true
}

const openEditZipcode = (zip) => {
    isEditing.value = true
    zipForm.z_id = zip.z_id
    zipForm.zipcode = zip.zipcode
    zipForm.area = zip.zipcode_associate_with
    showZipcodeModal.value = true
}

const submitZipcode = () => {
    zipForm.post(route('dispatch_scheduling.zipcode_management.store'), {
        onSuccess: () => {
            showZipcodeModal.value = false
            zipForm.reset()
        }
    })
}

const deleteZipcode = (id) => {
    if (confirm('Do you really want to delete this zipcode?')) {
        router.post(route('dispatch_scheduling.zipcode_management.destroySingle'), { z_id: id }, {
            preserveScroll: true
        })
    }
}

// Location Form
const locForm = useForm({
    schedule_settings_id: '',
    tiers_id: '',
    loc_zipcodes: '',
})

const openAddLocationZipcodes = () => {
    locForm.reset()
    showLocationModal.value = true
}

const submitLocationZipcodes = () => {
    locForm.post(route('dispatch_scheduling.zipcode_management.storeLocationZipcodes'), {
        onSuccess: () => {
            showLocationModal.value = false
            locForm.reset()
        }
    })
}

// Bulk Actions
const selectedIds = ref([])
const toggleAll = (e) => {
    if (e.target.checked) {
        selectedIds.value = props.zipcodes.data.map(z => z.z_id)
    } else {
        selectedIds.value = []
    }
}

const deleteSelected = () => {
    if (selectedIds.value.length === 0) {
        alert('Please select at least 1 zipcode.')
        return
    }
    if (confirm('Are you sure you want to delete?')) {
        router.post(route('dispatch_scheduling.zipcode_management.destroy'), { ids: selectedIds.value }, {
            onSuccess: () => {
                selectedIds.value = []
            }
        })
    }
}

const formatServiceDays = (zip) => {
    let days = []
    if (zip.monday == 1) days.push('Monday')
    if (zip.tuesday == 1) days.push('Tuesday')
    if (zip.wednesday == 1) days.push('Wednesday')
    if (zip.thursday == 1) days.push('Thursday')
    if (zip.friday == 1) days.push('Friday')
    if (zip.saturday == 1) days.push('Saturday')
    if (zip.sunday == 1) days.push('Sunday')
    return days.join(' ')
}
</script>

<template>
    <Head title="Zipcode Management" />

    <div class="container-fluid dash">
        <div class="dashboarddiv">
            <div class="row">
                <div class="col-xs-12">
                    <div class="box">
                        <div class="box-header">
                            <div class="btn-toolbar pull-right">
                                <div class="btn-group">
                                    <button @click="openAddZipcode" class="btn btn-primary" style="margin-right: 10px;">
                                        <span class="glyphicon glyphicon-plus"></span> New Zipcode
                                    </button>
                                    <button @click="openAddLocationZipcodes" class="btn btn-warning">
                                        <span class="glyphicon glyphicon-plus"></span> New Zipcode(s) to Location
                                    </button>
                                </div>
                            </div>
                            <h3 class="box-title">Zipcode Management</h3>
                        </div>

                        <div class="box-body">
                            <!-- Flash Messages -->
                            <div v-if="page.props.flash?.success" class="alert alert-success">
                                {{ page.props.flash.success }}
                            </div>
                            <div v-if="page.props.flash?.error" class="alert alert-danger">
                                {{ page.props.flash.error }}
                            </div>

                            <!-- Filters -->
                            <div class="row" style="margin-bottom: 20px;">
                                <div class="col-md-3">
                                    <label>Search:</label>
                                    <input v-model="filterSearch" type="text" class="form-control" placeholder="Search zipcodes..." @keyup.enter="applyFilters">
                                </div>
                                <div class="col-md-3">
                                    <label>Area:</label>
                                    <select v-model="filterArea" class="form-control" @change="applyFilters">
                                        <option value="">- All Areas -</option>
                                        <option v-for="area in areas" :key="area.zipcode" :value="area.zipcode">
                                            {{ area.terminal_name || area.city }} ({{ area.short_code }})
                                        </option>
                                    </select>
                                </div>
                                <div class="col-md-3">
                                    <label>Service Day:</label>
                                    <select v-model="filterDay" class="form-control" @change="applyFilters">
                                        <option value="">- All Days -</option>
                                        <option value="monday">Monday</option>
                                        <option value="tuesday">Tuesday</option>
                                        <option value="wednesday">Wednesday</option>
                                        <option value="thursday">Thursday</option>
                                        <option value="friday">Friday</option>
                                        <option value="saturday">Saturday</option>
                                        <option value="sunday">Sunday</option>
                                    </select>
                                </div>
                                <div class="col-md-3">
                                    <label>&nbsp;</label>
                                    <button @click="applyFilters" class="btn btn-success form-control">Apply Filters</button>
                                </div>
                            </div>

                            <div class="table-responsive">
                                <table class="table table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th style="width: 40px;"><input type="checkbox" @change="toggleAll"></th>
                                            <th>Zipcode</th>
                                            <th>City</th>
                                            <th>State</th>
                                            <th>Area</th>
                                            <th>Location</th>
                                            <th>Service Days</th>
                                            <th>Created On</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="zip in zipcodes.data" :key="zip.z_id">
                                            <td><input type="checkbox" :value="zip.z_id" v-model="selectedIds"></td>
                                            <td>{{ zip.zipcode }}</td>
                                            <td>{{ zip.city }}</td>
                                            <td>{{ zip.state }}</td>
                                            <td>{{ zip.zipcode_associate_with_formatted || zip.zipcode_associate_with }}</td>
                                            <td>{{ zip.loc_name }}</td>
                                            <td>{{ formatServiceDays(zip) }}</td>
                                            <td>{{ zip.created_at }}</td>
                                            <td>
                                                <button @click="openEditZipcode(zip)" class="btn btn-sm btn-info" style="margin-right: 5px;">Edit</button>
                                                <button @click="deleteZipcode(zip.z_id)" class="btn btn-sm btn-danger">Delete</button>
                                            </td>
                                        </tr>
                                        <tr v-if="zipcodes.data.length === 0">
                                            <td colspan="7" class="text-center">No zipcodes found.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <!-- Bulk Delete -->
                            <div style="margin-top: 15px;">
                                <button @click="deleteSelected" class="btn btn-danger">Delete Selected</button>
                            </div>
                            
                            <!-- Pagination (Simple manual approach for Inertia) -->
                            <div style="margin-top: 15px;" v-if="zipcodes.total > zipcodes.per_page">
                                <ul class="pagination">
                                    <li :class="{ disabled: zipcodes.current_page <= 1 }">
                                        <button class="page-link" @click="router.get(route('dispatch_scheduling.zipcode_management.index'), { page: zipcodes.current_page - 1, ...filters })">Previous</button>
                                    </li>
                                    <li class="disabled"><span class="page-link">Page {{ zipcodes.current_page }}</span></li>
                                    <li :class="{ disabled: zipcodes.data.length < zipcodes.per_page }">
                                        <button class="page-link" @click="router.get(route('dispatch_scheduling.zipcode_management.index'), { page: zipcodes.current_page + 1, ...filters })">Next</button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Zipcode Modal -->
        <div v-if="showZipcodeModal" class="modal fade in" style="display: block; background: rgba(0,0,0,0.5);">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header alert-info">
                        <button type="button" class="close" @click="showZipcodeModal = false"><span>&times;</span></button>
                        <h4 class="modal-title">{{ isEditing ? 'Edit Zipcode' : 'New Zipcode' }}</h4>
                    </div>
                    <form @submit.prevent="submitZipcode" class="form-horizontal">
                        <div class="modal-body">
                            <div class="form-group" :class="{'has-error': zipForm.errors.zipcode}">
                                <label class="col-sm-4 control-label">Zipcode <span class="text-danger">*</span></label>
                                <div class="col-sm-8">
                                    <input v-model="zipForm.zipcode" type="text" class="form-control" required>
                                    <span class="help-block" v-if="zipForm.errors.zipcode">{{ zipForm.errors.zipcode }}</span>
                                </div>
                            </div>
                            <div class="form-group" :class="{'has-error': zipForm.errors.area}">
                                <label class="col-sm-4 control-label">Area <span class="text-danger">*</span></label>
                                <div class="col-sm-8">
                                    <select v-model="zipForm.area" class="form-control" required>
                                        <option value="">-Select Area-</option>
                                        <option v-for="area in areas" :key="area.zipcode" :value="area.zipcode">
                                            {{ area.terminal_name || area.city }} ({{ area.short_code }})
                                        </option>
                                    </select>
                                    <span class="help-block" v-if="zipForm.errors.area">{{ zipForm.errors.area }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" @click="showZipcodeModal = false">Close</button>
                            <button type="submit" class="btn btn-primary" :disabled="zipForm.processing">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Location Zipcodes Modal -->
        <div v-if="showLocationModal" class="modal fade in" style="display: block; background: rgba(0,0,0,0.5);">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header alert-info">
                        <button type="button" class="close" @click="showLocationModal = false"><span>&times;</span></button>
                        <h4 class="modal-title">Add Zipcodes To Location</h4>
                    </div>
                    <form @submit.prevent="submitLocationZipcodes" class="form-horizontal">
                        <div class="modal-body">
                            <div class="form-group" :class="{'has-error': locForm.errors.schedule_settings_id}">
                                <label class="col-sm-3 control-label">Location: <span class="text-danger">*</span></label>
                                <div class="col-sm-9">
                                    <select v-model="locForm.schedule_settings_id" class="form-control" required>
                                        <option value="">-Choose Location-</option>
                                        <option v-for="loc in locations" :key="loc.id" :value="loc.id">
                                            {{ loc.loc_name }}
                                        </option>
                                    </select>
                                    <span class="help-block" v-if="locForm.errors.schedule_settings_id">{{ locForm.errors.schedule_settings_id }}</span>
                                </div>
                            </div>
                            <div class="form-group" :class="{'has-error': locForm.errors.tiers_id}">
                                <label class="col-sm-3 control-label">Tier: <span class="text-danger">*</span></label>
                                <div class="col-sm-9">
                                    <select v-model="locForm.tiers_id" class="form-control" required>
                                        <option value="">-Choose Tier-</option>
                                        <option v-for="tier in tiers" :key="tier.id" :value="tier.id">
                                            {{ tier.tier_name }}
                                        </option>
                                    </select>
                                    <span class="help-block" v-if="locForm.errors.tiers_id">{{ locForm.errors.tiers_id }}</span>
                                </div>
                            </div>
                            <div class="form-group" :class="{'has-error': locForm.errors.loc_zipcodes}">
                                <label class="col-sm-3 control-label">Zipcode(s) <span class="text-danger">*</span></label>
                                <div class="col-sm-9">
                                    <textarea v-model="locForm.loc_zipcodes" class="form-control" rows="5" required></textarea>
                                    <p class="help-block text-aqua">Enter comma separated zipcodes. For eg. 10001,10002,10003</p>
                                    <span class="help-block text-danger" v-if="locForm.errors.loc_zipcodes">{{ locForm.errors.loc_zipcodes }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" @click="showLocationModal = false">Close</button>
                            <button type="submit" class="btn btn-success" :disabled="locForm.processing">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal.fade.in {
    opacity: 1;
}
.page-link {
    background-color: #fff;
    border: 1px solid #ddd;
    color: #337ab7;
    padding: 6px 12px;
    cursor: pointer;
}
</style>

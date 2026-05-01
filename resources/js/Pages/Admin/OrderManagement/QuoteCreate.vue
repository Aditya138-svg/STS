<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { Head, Link, usePage } from '@inertiajs/vue3'
import axios from 'axios'

const page = usePage()
const createPage = computed(() => page.props.quoteCreate ?? {})
const customers = computed(() => createPage.value.customers ?? [])
const csrfToken = computed(() => createPage.value.csrf_token ?? document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '')
const errorMessage = computed(() => page.props.flash?.error ?? '')

const form = reactive({
    referral_source: 'existing_customer',
    users_id: '',
    referral_by: '',
    company_name: '',
    name: '',
    phone: '',
    email: '',
    customer_ref: '',
    po_number: '',
    order_type: '1',
    pay_note: '',
    origin_zip: '',
    origin_is_residence: false,
    origin_company_name: '',
    origin_contact_phone: '',
    origin_contact_email: '',
    origin_addressline1: '',
    origin_city: '',
    origin_state: '',
    dest_zip: '',
    dest_is_residence: false,
    dest_company_name: '',
    dest_contact_phone: '',
    dest_contact_email: '',
    dest_addressline1: '',
    dest_city: '',
    dest_state: '',
    service_levels_id: '1',
    valuation_coverage: '',
    additional_valuation_declined: true,
    deductible: '0',
    assembly_req: false,
    crating_req: false,
    packaging_req: false,
    unpackaging_req: false,
    stair_carry_req: false,
    num_of_flights: 0,
    notes: '',
    distance: '0.00',
})

const items = ref([
    {
        id: Date.now(),
        is_custom: true,
        package_type: '1',
        item_name: '',
        length: 1,
        width: 1,
        height: 1,
        weight: 1,
        quantity: 1,
        has_marble_or_stone: false,
    },
])

const internetSources = ['google', 'yahoo', 'msn', 'aol', 'ask', 'other']

const selectedCustomer = computed(() =>
    customers.value.find((customer) => String(customer.id) === String(form.users_id)) ?? null,
)

const customerLocked = computed(() => form.referral_source === 'existing_customer' && Boolean(selectedCustomer.value))

const associateText = computed(() => {
    const customer = selectedCustomer.value
    if (customer?.associate_company_name || customer?.associate_short_code) {
        return `This quote will be assigned to ${customer.associate_company_name || '-'} (${customer.associate_short_code || '-'})`
    }

    const associate = createPage.value.default_associate ?? {}
    return `By default this quote will be assigned to ${associate.company_name ?? 'FOX'} (${associate.short_code ?? 'OOX'})`
})

watch(() => form.referral_source, (value) => {
    if (value !== 'existing_customer') {
        form.users_id = ''
    }
})

watch(selectedCustomer, (customer) => {
    if (!customer) {
        return
    }

    form.company_name = customer.company_name || ''
    form.name = customer.name || customer.username || ''
    form.phone = customer.phone || ''
    form.email = customer.email || ''
})

const calcCubes = (item) => {
    const raw = (Number(item.length || 0) * Number(item.width || 0) * Number(item.height || 0)) / 1728
    const single = (raw % 1) >= 0.5 ? Math.ceil(raw) : Math.floor(raw)
    return Math.max(0, single * Number(item.quantity || 1))
}

const addItem = () => {
    items.value.push({
        id: Date.now() + items.value.length,
        is_custom: true,
        package_type: '1',
        item_name: '',
        length: 1,
        width: 1,
        height: 1,
        weight: 1,
        quantity: 1,
        has_marble_or_stone: false,
    })
}

const removeItem = (id) => {
    if (items.value.length === 1) {
        return
    }

    items.value = items.value.filter((item) => item.id !== id)
}

const originLocked = computed(() => form.order_type !== '1')

const applyOrderType = () => {
    if (originLocked.value) {
        form.origin_is_residence = false
        form.origin_company_name = ''
        form.origin_contact_phone = ''
        form.origin_contact_email = ''
        form.origin_addressline1 = ''
        form.origin_city = ''
        form.origin_state = ''
    }
}

const zipStatus = ref({
    origin: { status: null, message: '' },
    dest: { status: null, message: '' }
});

const verifyZip = async (type) => {
    const zip = form[`${type}_zip`];
    if (!zip) return;

    try {
        const response = await axios.get(`/admin/order-management/quotes/verify-zip/${zip}`);
        const data = response.data;
        
        if (data.found) {
            zipStatus.value[type] = {
                status: 'success',
                message: `${data.city}, ${data.state}`
            };
            form[`${type}_city`] = data.city || '';
            form[`${type}_state`] = data.state || '';
            form[`${type}_addressline1`] = data.addressline1 || '';
            form[`${type}_company_name`] = data.company_name || '';
            form[`${type}_contact_phone`] = data.contact_phone || '';
            form[`${type}_contact_email`] = data.contact_email || '';
        } else {
            zipStatus.value[type] = {
                status: 'error',
                message: 'We are not servicing at this ZIP right now.'
            };
            form[`${type}_city`] = '';
            form[`${type}_state`] = '';
            form[`${type}_addressline1`] = '';
            form[`${type}_company_name`] = '';
            form[`${type}_contact_phone`] = '';
            form[`${type}_contact_email`] = '';
        }
    } catch (error) {
        console.error('Error verifying zip:', error);
    }
};
</script>

<template>
    <Head :title="createPage.title ?? 'Create Quote'" />

    <div class="row">
        <div class="col-md-12">
            <div class="box box-primary quote-create-card">
                <div class="box-header with-border">
                    <Link class="btn btn-warning pull-left" :href="createPage.back_url ?? '/admin/order-management/quotes'">
                        <i class="fa fa-arrow-left" aria-hidden="true"></i>
                        Back
                    </Link>
                </div>

                <form id="frmQuote" :action="createPage.submit_url ?? '#'" method="post" enctype="multipart/form-data">
                    <input type="hidden" name="_token" :value="csrfToken">
                    <fieldset>
                        <div class="box-body">
                            <div v-if="errorMessage" class="alert alert-danger quote-create-alert">
                                {{ errorMessage }}
                            </div>

                            <legend>Referral Source</legend>
                            <div class="form-group">
                                <label>How do you hear about us?</label>
                                <div class="radio quote-radio-line">
                                    <label v-for="source in createPage.referral_sources ?? []" :key="source.value">
                                        <input v-model="form.referral_source" type="radio" name="referral_source" :value="source.value">
                                        {{ source.label }}
                                    </label>
                                </div>

                                <div v-if="form.referral_source === 'existing_customer'" class="form-inline-block">
                                    <label for="users_id">Customer</label>
                                    <select id="users_id" v-model="form.users_id" name="users_id" class="form-control customer-select">
                                        <option value="">-Select Customer-</option>
                                        <option v-for="customer in customers" :key="customer.id" :value="String(customer.id)">
                                            {{ customer.display_name || customer.name || customer.username || customer.email || `Customer #${customer.id}` }}
                                        </option>
                                    </select>
                                </div>

                                <div class="associate-note">
                                    <label>Associate</label>
                                    <p>{{ associateText }}</p>
                                </div>
                            </div>

                            <div v-if="form.referral_source === 'recommendation'" class="form-group col-sm-10">
                                <label for="referral_by">Recommended By:</label>
                                <input id="referral_by" v-model="form.referral_by" type="text" name="referral_by" class="form-control">
                            </div>
                            <div v-else-if="form.referral_source === 'internet'" class="form-group col-sm-10">
                                <label>Internet Source:</label>
                                <div class="radio quote-radio-line">
                                    <label v-for="source in internetSources" :key="source">
                                        <input v-model="form.referral_by" type="radio" name="referral_by" :value="source">
                                        {{ source.toUpperCase() }}
                                    </label>
                                </div>
                            </div>
                            <div v-else-if="form.referral_source === 'other'" class="form-group col-sm-10">
                                <label for="referral_by_other">Other:</label>
                                <input id="referral_by_other" v-model="form.referral_by" type="text" name="referral_by" class="form-control">
                            </div>
                            <div class="clearfix"></div>

                            <legend>General Details</legend>
                            <div class="row">
                                <div class="form-group col-sm-6">
                                    <label>Company Name</label>
                                    <input v-model="form.company_name" name="company_name" type="text" class="form-control" placeholder="Enter company name" :readonly="customerLocked">
                                </div>
                                <div class="form-group col-sm-6">
                                    <label>Name <sup><i class="fa fa-asterisk c-red f-size-7"></i></sup></label>
                                    <input v-model="form.name" name="name" type="text" class="form-control" placeholder="Enter name" :readonly="customerLocked" required>
                                </div>
                                <div class="form-group col-sm-6">
                                    <label>Phone <sup><i class="fa fa-asterisk c-red f-size-7"></i></sup></label>
                                    <input v-model="form.phone" name="phone" type="text" maxlength="10" class="form-control" placeholder="Enter phone number" :readonly="customerLocked" required>
                                </div>
                                <div class="form-group col-sm-6">
                                    <label>Email address <sup><i class="fa fa-asterisk c-red f-size-7"></i></sup></label>
                                    <input v-model="form.email" name="email" type="email" class="form-control" placeholder="Enter email" :readonly="customerLocked" required>
                                </div>
                                <div class="form-group col-sm-6">
                                    <label>Customer Reference</label>
                                    <input v-model="form.customer_ref" name="customer_ref" type="text" class="form-control" placeholder="Enter Customer Reference">
                                </div>
                                <div class="form-group col-sm-6">
                                    <label>PO Number</label>
                                    <input v-model="form.po_number" name="po_number" type="text" class="form-control" placeholder="Enter PO Number">
                                </div>
                                <div class="form-group col-sm-6">
                                    <label>Type <sup><i class="fa fa-asterisk c-red f-size-7"></i></sup></label>
                                    <select v-model="form.order_type" name="order_type" class="form-control" @change="applyOrderType">
                                        <option v-for="type in createPage.order_types ?? []" :key="type.value" :value="type.value">{{ type.label }}</option>
                                    </select>
                                </div>
                                <div class="form-group col-sm-6">
                                    <label>Pay Note</label>
                                    <input v-model="form.pay_note" name="pay_note" type="text" maxlength="255" class="form-control" placeholder="Enter Pay Note, for eg, who is responsible for payment">
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-sm-12 col-md-6">
                                    <h4>Origin</h4>
                                    <div class="form-group row">
                                        <label class="col-sm-4 control-label">Zipcode <sup><i class="fa fa-asterisk c-red f-size-7"></i></sup></label>
                                        <div class="col-sm-8">
                                            <div class="input-group">
                                                <input v-model="form.origin_zip" name="origin_zip" type="text" maxlength="5" class="form-control" placeholder="Enter Origin Zipcode" required>
                                                <div class="input-group-btn"><button type="button" class="btn btn-info" @click="verifyZip('origin')">Verify</button></div>
                                            </div>
                                            <div v-if="zipStatus.origin.status === 'error'" class="text-danger" style="margin-top: 5px;">
                                                <small>{{ zipStatus.origin.message }}</small>
                                            </div>
                                            <div v-if="zipStatus.origin.status === 'success'" class="text-success" style="margin-top: 5px;">
                                                <small><strong>{{ zipStatus.origin.message }}</strong></small>
                                            </div>
                                            <input v-model="form.distance" type="hidden" name="distance">
                                            <div class="checkbox">
                                                <label><input v-model="form.origin_is_residence" name="origin_is_residence" type="checkbox" :disabled="originLocked"> Is Residence?</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-for="field in [
                                        ['origin_company_name', 'Name', 'Enter company name'],
                                        ['origin_contact_phone', 'Contact Phone', 'Enter phone number'],
                                        ['origin_contact_email', 'Email address', 'Enter email'],
                                        ['origin_addressline1', 'Street Address', 'Enter Street Address'],
                                        ['origin_city', 'City', 'Enter City'],
                                        ['origin_state', 'State', 'Enter State'],
                                    ]" :key="field[0]" class="form-group row">
                                        <label class="col-sm-4 control-label">{{ field[1] }}</label>
                                        <div class="col-sm-8">
                                            <input v-model="form[field[0]]" :name="field[0]" :type="field[0].includes('email') ? 'email' : 'text'" class="form-control" :placeholder="field[2]" :readonly="originLocked">
                                        </div>
                                    </div>
                                </div>

                                <div class="col-sm-12 col-md-6">
                                    <h4>Destination</h4>
                                    <div class="form-group row">
                                        <label class="col-sm-4 control-label">Zipcode <sup><i class="fa fa-asterisk c-red f-size-7"></i></sup></label>
                                        <div class="col-sm-8">
                                            <div class="input-group">
                                                <input v-model="form.dest_zip" name="dest_zip" type="text" maxlength="5" class="form-control" placeholder="Enter Destination Zipcode" required>
                                                <div class="input-group-btn"><button type="button" class="btn btn-info" @click="verifyZip('dest')">Verify</button></div>
                                            </div>
                                            <div v-if="zipStatus.dest.status === 'error'" class="text-danger" style="margin-top: 5px;">
                                                <small>{{ zipStatus.dest.message }}</small>
                                            </div>
                                            <div v-if="zipStatus.dest.status === 'success'" class="text-success" style="margin-top: 5px;">
                                                <small><strong>{{ zipStatus.dest.message }}</strong></small>
                                            </div>
                                            <div class="checkbox">
                                                <label><input v-model="form.dest_is_residence" name="dest_is_residence" type="checkbox"> Is Residence?</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-for="field in [
                                        ['dest_company_name', 'Name', 'Enter company name'],
                                        ['dest_contact_phone', 'Contact Phone', 'Enter phone number'],
                                        ['dest_contact_email', 'Email address', 'Enter email'],
                                        ['dest_addressline1', 'Street Address', 'Enter Street Address'],
                                        ['dest_city', 'City', 'Enter City'],
                                        ['dest_state', 'State', 'Enter State'],
                                    ]" :key="field[0]" class="form-group row">
                                        <label class="col-sm-4 control-label">{{ field[1] }}</label>
                                        <div class="col-sm-8">
                                            <input v-model="form[field[0]]" :name="field[0]" :type="field[0].includes('email') ? 'email' : 'text'" class="form-control" :placeholder="field[2]">
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <legend>Service Level</legend>
                            <div class="form-group">
                                <select v-model="form.service_levels_id" name="service_levels_id" class="form-control" required>
                                    <option v-for="level in createPage.service_levels ?? []" :key="level.value" :value="level.value">{{ level.label }}</option>
                                </select>
                            </div>

                            <legend>Items</legend>
                            <div class="form-group table-responsive no-padding">
                                <table class="table table-hover quote-item-table">
                                    <thead>
                                        <tr>
                                            <th>Custom?</th>
                                            <th>Packaging Type</th>
                                            <th>Description <sup><i class="fa fa-asterisk c-red f-size-7"></i></sup></th>
                                            <th>Length (in)</th>
                                            <th>Width (in)</th>
                                            <th>Height (in)</th>
                                            <th>Weight (lbs)</th>
                                            <th>Quantity <sup><i class="fa fa-asterisk c-red f-size-7"></i></sup></th>
                                            <th>Total Cubes</th>
                                            <th>Has marble or stones?</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="item in items" :key="item.id">
                                            <td><input v-model="item.is_custom" type="checkbox" disabled></td>
                                            <td>
                                                <select v-model="item.package_type" name="package_type[]" class="form-control">
                                                    <option v-for="type in createPage.package_types ?? []" :key="type.value" :value="type.value">{{ type.label }}</option>
                                                </select>
                                            </td>
                                            <td><input v-model="item.item_name" name="item_name[]" type="text" class="form-control" placeholder="Enter item" required></td>
                                            <td><input v-model.number="item.length" name="item_length[]" type="number" min="1" class="form-control padding_5px" required></td>
                                            <td><input v-model.number="item.width" name="item_width[]" type="number" min="1" class="form-control padding_5px" required></td>
                                            <td><input v-model.number="item.height" name="item_height[]" type="number" min="1" class="form-control padding_5px" required></td>
                                            <td><input v-model.number="item.weight" name="item_weight[]" type="number" min="1" class="form-control padding_5px" required></td>
                                            <td><input v-model.number="item.quantity" name="item_qty[]" type="number" min="1" class="form-control padding_5px" required></td>
                                            <td>
                                                <input :value="calcCubes(item)" name="item_cubes[]" type="number" class="form-control padding_5px" readonly>
                                            </td>
                                            <td><input v-model="item.has_marble_or_stone" name="item_has_marble_or_stone[]" type="checkbox"></td>
                                            <td>
                                                <button type="button" class="btn btn-link text-danger" title="Remove item" @click="removeItem(item.id)">
                                                    <i class="fa fa-trash fa-lg"></i>
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colspan="11">
                                                <button type="button" class="btn btn-link add-item-btn" @click="addItem">
                                                    <i class="fa fa-plus fa-lg"></i>
                                                    Add New Item
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <legend>Upload Images</legend>
                            <div class="form-group">
                                <input type="file" name="quote_images[]" class="form-control" multiple>
                            </div>

                            <legend>Valuation</legend>
                            <div class="form-group">
                                <label>Valuation Coverage</label>
                                <input v-model="form.valuation_coverage" name="valuation_coverage" type="number" step="any" min="0" class="form-control" placeholder="0.00">
                            </div>
                            <div class="form-group">
                                <label class="valuation-decline">
                                    <input v-model="form.additional_valuation_declined" name="additional_valuation_declined" type="checkbox">
                                    No additional valuation coverage selected. This shipment is covered at $.60/lb.
                                </label>
                                <select v-model="form.deductible" name="deductible" class="form-control" :disabled="form.additional_valuation_declined">
                                    <option v-for="deductible in createPage.deductibles ?? []" :key="deductible.value" :value="deductible.value">{{ deductible.label }}</option>
                                </select>
                            </div>

                            <legend>Accessorials</legend>
                            <div class="form-group">
                                <label>Please check all that apply.</label>
                                <div class="checkbox accessorial-grid">
                                    <label><input v-model="form.assembly_req" name="assembly_req" type="checkbox"> Assembly Required</label>
                                    <label><input v-model="form.crating_req" name="crating_req" type="checkbox"> Crating Required</label>
                                    <label><input v-model="form.packaging_req" name="packaging_req" type="checkbox"> Packaging Required</label>
                                    <label><input v-model="form.unpackaging_req" name="unpackaging_req" type="checkbox"> Unpackaging Required</label>
                                    <label><input v-model="form.stair_carry_req" name="stair_carry_req" type="checkbox"> Stair Carry Required</label>
                                    <label class="flight-input">
                                        <input v-model.number="form.num_of_flights" name="num_of_flights" type="number" min="0" :disabled="!form.stair_carry_req">
                                        Number Of Flights
                                    </label>
                                </div>
                            </div>

                            <div class="form-group">
                                <label>Notes</label>
                                <textarea v-model="form.notes" name="notes" rows="4" class="form-control" placeholder="Please enter notes"></textarea>
                            </div>
                        </div>

                        <div class="box-footer">
                            <Link class="btn btn-warning pull-left" :href="createPage.back_url ?? '/admin/order-management/quotes'">
                                <i class="fa fa-arrow-left" aria-hidden="true"></i>
                                Back
                            </Link>
                            <button type="submit" class="btn btn-primary pull-right">Submit</button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
.quote-radio-line,
.accessorial-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 20px;
}

.quote-create-card {
    border-top: 3px solid #7fa5a1;
    box-shadow: none;
}

.quote-create-card .box-header {
    padding: 14px;
    border-bottom: 1px solid #f0c792;
}

.quote-create-card .box-body {
    padding: 18px 14px;
}

.quote-create-card legend {
    margin: 18px 0 14px;
    padding-bottom: 4px;
    border-bottom: 1px solid #ddd;
    font-size: 22px;
    font-weight: 400;
}

.quote-create-card .form-group {
    margin-bottom: 12px;
}

.quote-create-card label {
    font-size: 14px;
}

.quote-create-card .form-control {
    min-height: 34px;
    border-radius: 2px;
    font-size: 14px;
}

.quote-create-card input[readonly],
.quote-create-card input:disabled,
.quote-create-card select:disabled {
    background-color: #eee;
    cursor: not-allowed;
}

.quote-create-card .btn-warning {
    background-color: #f39c12;
    border-color: #e08e0b;
}

.quote-radio-line label,
.accessorial-grid label {
    padding-right: 20px !important;
}

.form-inline-block {
    display: inline-block;
    width: 375px;
    max-width: 100%;
    margin: 10px 0 0 14px;
    vertical-align: top;
}

.form-inline-block label {
    display: none;
}

.customer-select {
    width: 100%;
}

.associate-note {
    margin: 14px 0 40px 18px;
}

.associate-note p {
    font-size: 14px;
    margin: 8px 0 0;
}

.quote-create-card h4 {
    font-size: 18px;
}

.quote-item-table th,
.quote-item-table td {
    font-size: 13px;
}

.padding_5px {
    padding: 5px !important;
}

.quote-item-table th,
.quote-item-table td {
    min-width: 100px;
    vertical-align: middle !important;
}

.quote-item-table th:nth-child(3),
.quote-item-table td:nth-child(3) {
    min-width: 220px;
}

.add-item-btn {
    color: #00a65a !important;
    padding-left: 0;
}

.valuation-decline {
    display: flex;
    gap: 8px;
    align-items: center;
    font-weight: 400;
}

.flight-input input {
    width: 54px;
    margin-right: 5px;
}

.c-red {
    color: #dd4b39;
}

.f-size-7 {
    font-size: 7px;
}
</style>

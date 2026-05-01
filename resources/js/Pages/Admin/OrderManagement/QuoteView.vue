<script setup>
import { computed, ref, watch } from 'vue'
import { Head, Link, usePage } from '@inertiajs/vue3'

const page = usePage()
const quote = computed(() => page.props.quoteView ?? {})
const general = computed(() => quote.value.general ?? {})
const pricing = computed(() => quote.value.pricing ?? {})

const money = (value) => `$${Number(value ?? 0).toFixed(2)}`
const numeric = (value) => {
    const parsed = Number(value ?? 0)
    return Number.isFinite(parsed) ? parsed : 0
}

const priceMode = ref(pricing.value.is_automatic === '1' ? 'automatic' : 'manual')
const isPriceLocked = ref(Boolean(pricing.value.is_price_lock))
const priceModel = ref(pricing.value.price_model || 'Standard')
const discountType = ref(pricing.value.discount_type === '1' ? 'percentage' : 'fixed')
const discountValue = ref(numeric(pricing.value.discount_value))
const deliveryCharges = ref(numeric(pricing.value.delivery_charges))
const insuranceCharges = ref(numeric(pricing.value.insurance_charges))
const accessoryCharges = ref(numeric(pricing.value.accessory_charges))
const pickupCharges = ref(numeric(pricing.value.pickup_charges))

const priceModels = [
    'Standard',
    'DesignMart',
    'DesignMart (-10%)',
    'DesignMart(Lower Transfer)',
    'DesignMart (Pickup)',
    'Dot & Bo',
    'Khrome Studios',
    'ShipHawk',
    'Transit Systems',
]

const totalAmount = computed(() =>
    numeric(deliveryCharges.value)
    + numeric(insuranceCharges.value)
    + numeric(accessoryCharges.value)
    + numeric(pickupCharges.value),
)

watch(pricing, (value) => {
    priceMode.value = value.is_automatic === '1' ? 'automatic' : 'manual'
    isPriceLocked.value = Boolean(value.is_price_lock)
    priceModel.value = value.price_model || 'Standard'
    discountType.value = value.discount_type === '1' ? 'percentage' : 'fixed'
    discountValue.value = numeric(value.discount_value)
    deliveryCharges.value = numeric(value.delivery_charges)
    insuranceCharges.value = numeric(value.insurance_charges)
    accessoryCharges.value = numeric(value.accessory_charges)
    pickupCharges.value = numeric(value.pickup_charges)
})

const statusClass = computed(() => {
    const status = String(quote.value.status ?? '').toLowerCase()
    if (status.includes('approved') || status.includes('accepted')) return 'success'
    if (status.includes('pending')) return 'warning'
    return 'danger'
})

const detailRows = computed(() => [
    ['Company Name', general.value.company_name],
    ['Name', general.value.name],
    ['Phone', general.value.phone],
    ['Email address', general.value.email],
    ['Customer Reference', general.value.customer_ref],
    ['PO Number', general.value.po_number],
    ['Type', general.value.order_type],
    ['Associate', [general.value.associate, general.value.associate_short_code ? `(${general.value.associate_short_code})` : ''].filter(Boolean).join(' ')],
])

const addressLines = (address) => [
    address?.company_name,
    address?.phone,
    address?.email,
    address?.addressline1,
    [address?.detail, address?.type ? `(${address.type})` : ''].filter(Boolean).join(' '),
].filter(Boolean)
</script>

<template>
    <Head :title="quote.title ?? 'Quote View'" />

    <div class="row view-order-box">
        <div class="col-md-12">
            <div class="box box-primary word-break">
                <div class="box-header with-border quote-view-header">
                    <Link class="btn smallbtn btn-warning" :href="quote.urls?.back ?? '/admin/order-management/quotes'">
                        <i class="fa fa-arrow-left" aria-hidden="true"></i>
                        Back
                    </Link>

                    <div class="btn-toolbar quote-actions">
                        <div class="btn-group" v-if="!['Closed', 'Declined'].includes(quote.status)">
                            <button type="button" class="btn smallbtn btn-danger" disabled>
                                <i class="fa fa-ban"></i>
                                Decline
                            </button>
                        </div>
                        <div class="btn-group" v-if="quote.can_make_order">
                            <Link :href="quote.urls?.make_order ?? '#'" class="btn smallbtn btn-info">
                                <i class="fa fa-shopping-cart"></i>
                                Make Order
                            </Link>
                        </div>
                        <div class="btn-group" v-if="!['Closed', 'Declined'].includes(quote.status)">
                            <button type="button" class="btn smallbtn btn-success" disabled>
                                <i class="fa fa-envelope"></i>
                                Send Mail To Customer
                            </button>
                        </div>
                    </div>
                </div>

                <div class="box-body view-box-label">
                    <div class="row quote-summary-row">
                        <div class="col-sm-4">
                            <div class="borders_orders box_one quote-summary-card">
                                <div class="summary-line">
                                    <label><span class="glyphicon glyphicon-triangle-right"></span>Quote#</label>
                                    <span>{{ quote.id }}</span>
                                </div>
                                <div class="summary-line">
                                    <label><span class="glyphicon glyphicon-triangle-right"></span>Date</label>
                                    <span>{{ quote.created_at || '-' }}</span>
                                </div>
                                <div class="summary-line">
                                    <label><span class="glyphicon glyphicon-triangle-right"></span>Status</label>
                                    <span :class="`btn btn-${statusClass} btn-xs default-cursor`">{{ quote.status || '-' }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="borders_orders box_two quote-summary-card">
                                <h3><i class="glyphicon glyphicon-cog"></i> Level of Service</h3>
                                <span><i class="glyphicon glyphicon-triangle-right"></i> {{ general.service_level || '-' }}</span>
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="borders_orders box_three quote-summary-card">
                                <h3><i class="glyphicon glyphicon-cog"></i> Referral Source</h3>
                                <span><i class="glyphicon glyphicon-triangle-right"></i> {{ general.referral_source || '-' }}</span>
                                <span v-if="general.referral_by"> {{ general.referral_by }}</span>
                            </div>
                        </div>
                    </div>

                    <section class="border-general-bill bill_to_print">
                        <legend class="legend_color"><span class="fa fa-angle-double-right"></span>General Details</legend>
                        <div class="padding-spacing quote-detail-grid">
                            <div v-for="[label, value] in detailRows" :key="label" class="quote-detail-row">
                                <label class="font-heading">{{ label }}</label>
                                <span>{{ value || '-' }}</span>
                            </div>
                            <div class="quote-detail-row quote-detail-row-tall">
                                <label class="font-heading">Origin</label>
                                <span>
                                    <p v-for="line in addressLines(quote.origin)" :key="line">{{ line }}</p>
                                    <p v-if="!addressLines(quote.origin).length">-</p>
                                </span>
                            </div>
                            <div class="quote-detail-row quote-detail-row-tall">
                                <label class="font-heading">Destination</label>
                                <span>
                                    <p v-for="line in addressLines(quote.destination)" :key="line">{{ line }}</p>
                                    <p v-if="!addressLines(quote.destination).length">-</p>
                                    <p v-if="quote.distance">Distance: {{ quote.distance }} mile(s)</p>
                                </span>
                            </div>
                            <div class="quote-detail-row quote-detail-row-wide">
                                <label class="font-heading">Pay Note</label>
                                <span>{{ general.pay_note || '-' }}</span>
                            </div>
                        </div>
                    </section>

                    <section class="border-general-bill bill_to_print">
                        <legend class="legend_color"><span class="fa fa-angle-double-right"></span>Items</legend>
                        <div class="padding-spacing table-responsive no-padding">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Pkg Type</th>
                                        <th>Description</th>
                                        <th title="Length (inches)">L (in)</th>
                                        <th title="Width (inches)">W (in)</th>
                                        <th title="Height (inches)">H (in)</th>
                                        <th title="Weight (pounds)">Wt (lbs)</th>
                                        <th>Qty</th>
                                        <th>T. Cubes</th>
                                        <th>T. Wts (lbs)</th>
                                        <th>Has marble or stones?</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in quote.items ?? []" :key="index">
                                        <td>{{ item.package_type || '-' }}</td>
                                        <td>{{ item.description || '-' }}</td>
                                        <td>{{ item.length || '-' }}</td>
                                        <td>{{ item.width || '-' }}</td>
                                        <td>{{ item.height || '-' }}</td>
                                        <td :class="{ 'bg-red': Number(item.weight) >= 300 }">{{ item.weight || '-' }}</td>
                                        <td>{{ item.quantity || '-' }}</td>
                                        <td>{{ item.cube || '-' }}</td>
                                        <td :class="{ 'bg-red': Number(item.weight) * Number(item.quantity) >= 300 }">
                                            {{ Number(item.weight || 0) * Number(item.quantity || 0) }}
                                        </td>
                                        <td>{{ item.has_marble_or_stone ? 'Yes' : 'No' }}</td>
                                    </tr>
                                    <tr v-if="!(quote.items ?? []).length">
                                        <td colspan="10" class="text-center text-muted">No items found.</td>
                                    </tr>
                                </tbody>
                            </table>

                            <legend>Valuation</legend>
                            <div class="quote-detail-grid">
                                <div class="quote-detail-row">
                                    <label class="font-heading">Valuation Coverage</label>
                                    <span>{{ money(quote.valuation?.coverage) }}</span>
                                </div>
                                <div class="quote-detail-row">
                                    <label class="font-heading">Additional Valuation Declined/Deductible</label>
                                    <span>{{ quote.valuation?.deductible || '-' }}</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section class="border-general-bill bill_to_print">
                        <legend class="legend_color"><span class="fa fa-angle-double-right"></span>Accessorials</legend>
                        <div class="padding-spacing quote-detail-grid">
                            <div v-for="(value, label) in quote.accessorials ?? {}" :key="label" class="quote-detail-row">
                                <label class="font-heading">{{ label }}:</label>
                                <span>{{ value }}</span>
                            </div>
                        </div>
                    </section>

                    <section class="border-general-bill bill_to_print">
                        <legend class="legend_color"><span class="fa fa-angle-double-right"></span></legend>
                        <div class="padding-spacing row">
                            <div class="col-xs-12 col-sm-12 col-md-6">
                                <p class="lead">Notes</p>
                                <p class="help-block">{{ quote.notes || '-' }}</p>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-6">
                                <p class="lead">Estimated Calculations</p>
                                <div class="price-mode-bar">
                                    <label class="price-choice">
                                        <input v-model="priceMode" type="radio" value="manual" :disabled="isPriceLocked">
                                        Manual
                                    </label>
                                    <label class="price-choice">
                                        <input v-model="priceMode" type="radio" value="automatic" :disabled="isPriceLocked">
                                        Automatic
                                    </label>
                                    <label class="price-lock">
                                        <input v-model="isPriceLocked" type="checkbox">
                                        Lock Price
                                    </label>
                                </div>

                                <div class="price-help">
                                    <p>If you lock the price than at the time of conversion of this quote to order, customer will use locked price otherwise price will get change based on altering some parameters (like zipcodes, items, accessories, etc).</p>
                                    <p><strong>PRICE DISCREPANCY:</strong> If the price for a quote is set to automatic, but later on the setting is changed, then the charges will be calculated based on new price setting for that 'quote' or when 'converting quote to order'.</p>
                                </div>

                                <div v-if="priceMode === 'automatic'" class="automatic-price-options">
                                    <label class="price-option-row">
                                        <span>Price Modal</span>
                                        <select v-model="priceModel" class="form-control" :disabled="isPriceLocked">
                                            <option v-for="model in priceModels" :key="model" :value="model">{{ model }}</option>
                                        </select>
                                    </label>
                                    <div class="price-option-row">
                                        <span>Discount Information</span>
                                        <div class="discount-controls">
                                            <label>
                                                <input v-model="discountType" type="radio" value="fixed" :disabled="isPriceLocked">
                                                Fixed
                                            </label>
                                            <label>
                                                <input v-model="discountType" type="radio" value="percentage" :disabled="isPriceLocked">
                                                Percentage
                                            </label>
                                        </div>
                                    </div>
                                    <div class="input-group discount-input">
                                        <span class="input-group-addon">$</span>
                                        <input v-model.number="discountValue" type="number" class="form-control tar_pr5" :disabled="isPriceLocked">
                                    </div>
                                </div>

                                <table class="table table-hover quote-price-table">
                                    <tbody>
                                        <tr>
                                            <th>Estimated Delivery Charge:</th>
                                            <td>
                                                <div v-if="priceMode === 'manual'" class="input-group price-input">
                                                    <span class="input-group-addon">$</span>
                                                    <input v-model.number="deliveryCharges" type="number" min="0" class="form-control tar_pr5" :disabled="isPriceLocked">
                                                </div>
                                                <span v-else>{{ money(deliveryCharges) }}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Insurance Charge:</th>
                                            <td>
                                                <div v-if="priceMode === 'manual'" class="input-group price-input">
                                                    <span class="input-group-addon">$</span>
                                                    <input v-model.number="insuranceCharges" type="number" min="0" class="form-control tar_pr5" :disabled="isPriceLocked">
                                                </div>
                                                <span v-else>{{ money(insuranceCharges) }}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Accessorial Charge:</th>
                                            <td>
                                                <div v-if="priceMode === 'manual'" class="input-group price-input">
                                                    <span class="input-group-addon">$</span>
                                                    <input v-model.number="accessoryCharges" type="number" min="0" class="form-control tar_pr5" :disabled="isPriceLocked">
                                                </div>
                                                <span v-else>{{ money(accessoryCharges) }}</span>
                                            </td>
                                        </tr>
                                        <tr v-if="pickupCharges || priceMode === 'manual'">
                                            <th>Pickup Charge:</th>
                                            <td>
                                                <div v-if="priceMode === 'manual'" class="input-group price-input">
                                                    <span class="input-group-addon">$</span>
                                                    <input v-model.number="pickupCharges" type="number" min="0" class="form-control tar_pr5" :disabled="isPriceLocked">
                                                </div>
                                                <span v-else>{{ money(pickupCharges) }}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Total Amount:</th>
                                            <td class="quote-total">{{ money(totalAmount) }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                </div>

                <div class="box-footer quote-view-footer">
                    <Link class="btn smallbtn btn-warning" :href="quote.urls?.back ?? '/admin/order-management/quotes'">
                        <i class="fa fa-arrow-left" aria-hidden="true"></i>
                        Back
                    </Link>
                    <div class="btn-toolbar quote-actions">
                        <div class="btn-group" v-if="quote.can_edit">
                            <Link :href="quote.urls?.edit ?? '#'" class="btn smallbtn btn-danger">Edit</Link>
                        </div>
                        <div class="btn-group" v-if="!['Closed', 'Declined'].includes(quote.status)">
                            <button type="button" class="btn smallbtn btn-primary" disabled>Save Price</button>
                        </div>
                        <div class="btn-group" v-if="quote.can_make_order">
                            <Link :href="quote.urls?.make_order ?? '#'" class="btn smallbtn btn-info">
                                <i class="fa fa-shopping-cart"></i>
                                Make Order
                            </Link>
                        </div>
                        <div class="btn-group" v-if="!['Closed', 'Declined'].includes(quote.status)">
                            <button type="button" class="btn smallbtn btn-success" disabled>
                                <i class="fa fa-envelope"></i>
                                Send Mail To Customer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.quote-view-header,
.quote-view-footer {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
}

.quote-actions {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
}

.quote-summary-row {
    margin-bottom: 18px;
}

.quote-summary-card {
    min-height: 118px;
    padding: 14px;
    color: #fff;
    background: #7fa19d;
}

.quote-summary-card h3 {
    margin: 0 0 18px;
    font-size: 20px;
}

.box_one {
    background: #6f8f8b;
}

.box_two {
    background: #7b9b7a;
}

.box_three {
    background: #8d806f;
}

.summary-line {
    display: grid;
    grid-template-columns: 42% 1fr;
    gap: 8px;
    margin-bottom: 10px;
}

.border-general-bill {
    border: 1px solid #ddd;
    margin: 0 0 18px;
    background: #fff;
}

.legend_color {
    color: #00695c;
    padding: 10px 14px 0;
    margin-bottom: 0;
    border: 0;
    font-size: 20px;
}

.padding-spacing {
    padding: 14px;
}

.quote-detail-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(220px, 1fr));
    column-gap: 28px;
}

.quote-detail-row {
    display: grid;
    grid-template-columns: minmax(140px, 45%) 1fr;
    gap: 12px;
    margin-bottom: 12px;
}

.quote-detail-row-wide,
.quote-detail-row-tall {
    align-items: start;
}

.quote-detail-row p {
    margin: 0 0 3px;
}

.font-heading {
    font-weight: 700;
}

.bg-red {
    background: #dd4b39 !important;
    color: #fff;
}

.price-mode-bar {
    display: flex;
    align-items: center;
    gap: 22px;
    margin: 28px 0 14px;
    flex-wrap: wrap;
}

.price-choice {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    font-size: 18px;
    line-height: 1;
    font-weight: 700;
}

.price-lock {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin: 0;
    color: #a94442;
    font-size: 14px;
    font-weight: 700;
}

.price-help {
    color: #a94442;
    font-size: 14px;
    line-height: 1.35;
    margin-bottom: 24px;
}

.automatic-price-options {
    margin-bottom: 26px;
}

.price-option-row {
    display: grid;
    grid-template-columns: 240px 1fr;
    gap: 20px;
    align-items: center;
    margin-bottom: 12px;
    font-size: 14px;
    font-weight: 400;
}

.discount-controls {
    display: flex;
    gap: 16px;
    align-items: center;
    font-weight: 700;
}

.discount-controls label {
    display: inline-flex;
    gap: 8px;
    align-items: center;
    margin: 0;
}

.discount-input {
    width: calc(100% - 260px);
    margin-left: 260px;
}

.quote-price-table {
    border: 1px solid #d8d8d8;
}

.quote-price-table th {
    width: 55%;
    font-size: 14px;
    vertical-align: middle !important;
}

.quote-price-table td {
    text-align: right;
    font-size: 14px;
    vertical-align: middle !important;
}

.price-input {
    width: 125px;
    margin-left: auto;
}

.quote-total {
    color: #0073b7;
    font-weight: 700;
}

@media (max-width: 767px) {
    .quote-detail-grid,
    .quote-detail-row,
    .summary-line {
        grid-template-columns: 1fr;
    }

    .price-option-row {
        grid-template-columns: 1fr;
    }

    .discount-input {
        width: 100%;
        margin-left: 0;
    }
}
</style>

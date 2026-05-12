<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { Head, Link, usePage } from '@inertiajs/vue3';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import { useGuestAssets } from '@/Composables/Guest';
import axios from 'axios';
import '../../../css/guest/guest-calculator.css';

const props = defineProps({
    serviceLevels: {
        type: Array,
        default: () => []
    },
    title: {
        type: String,
        default: 'Shipping Calculator'
    }
});

const page = usePage();
const { route, asset } = useGuestAssets();

const calcBy = ref('weight'); // 'weight' or 'size'
const form = reactive({
    weight: '',
    length: '',
    width: '',
    height: '',
    qty: 1,
    originZip: '',
    destZip: '',
    serviceLevelId: props.serviceLevels.length > 0 ? props.serviceLevels[0].id : 1,
});

const result = ref(null);
const loading = ref(false);
const error = ref(null);

const cubes = computed(() => {
    if (calcBy.value === 'size' && form.length && form.width && form.height) {
        return ((parseFloat(form.length) * parseFloat(form.width) * parseFloat(form.height)) / 1728 * parseInt(form.qty || 1)).toFixed(2);
    }
    return 0;
});

const toggleCalcBy = (val) => {
    calcBy.value = val;
    result.value = null;
    error.value = null;
};

const calculate = async () => {
    if (loading.value) return;
    
    loading.value = true;
    error.value = null;
    result.value = null;

    try {
        const response = await axios.post(route('guest.shipping_calculator.calculate'), {
            calc_by: calcBy.value,
            weight: form.weight,
            length: form.length,
            width: form.width,
            height: form.height,
            qty: form.qty,
            origin_zip: form.originZip,
            dest_zip: form.destZip,
            service_levels_id: form.serviceLevelId
        });

        if (response.data.success) {
            result.value = response.data.data;
        } else {
            error.value = response.data.message || 'Calculation failed. Please check your inputs.';
        }
    } catch (err) {
        error.value = err.response?.data?.message || 'An error occurred during calculation.';
    } finally {
        loading.value = false;
    }
};

const reset = () => {
    form.weight = '';
    form.length = '';
    form.width = '';
    form.height = '';
    form.qty = 1;
    form.originZip = '';
    form.destZip = '';
    result.value = null;
    error.value = null;
};

onMounted(() => {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                entry.target.classList.remove('is-visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        observer.observe(el);
    });
});
</script>

<template>
    <GuestLayout>
        <Head :title="title" />

        <div class="guest-home guest-calculator-page">
            <!-- Hero Section -->
            <header class="calc-hero-section">
                <div class="container">
                    <div class="calc-hero-grid">
                        <div class="calc-hero-copy">
                            <p class="calc-hero-kicker">Smart Estimator</p>
                            <h1 class="calc-hero-title">Plan Your Shipment with Precision</h1>
                            <p class="calc-hero-lead">Our advanced logistics calculator provides instant, transparent pricing for weight and size-based cargo across our entire network.</p>
                        </div>
                        <div class="calc-hero-visual">
                            <img :src="asset('images/wp/calculator.svg')" alt="Calculator" class="calc-hero-img">
                        </div>
                    </div>
                </div>
            </header>

            <!-- Main Calculator Section -->
            <section class="calculator-main-section">
                <div class="container">
                    <div class="calculator-card reveal-on-scroll">
                        <div class="card-grid">
                            <!-- Left: Form -->
                            <div class="form-side">
                                <div class="method-toggle">
                                    <button 
                                        @click="toggleCalcBy('weight')" 
                                        :class="['toggle-btn', calcBy === 'weight' ? 'active' : '']"
                                    >Weight</button>
                                    <button 
                                        @click="toggleCalcBy('size')" 
                                        :class="['toggle-btn', calcBy === 'size' ? 'active' : '']"
                                    >Size / Volume</button>
                                </div>

                                <form @submit.prevent="calculate" class="calc-form">
                                    <div v-if="calcBy === 'weight'" class="input-group">
                                        <label class="input-label">Weight (LBS)</label>
                                        <input type="number" v-model="form.weight" class="form-input" placeholder="e.g. 150" required>
                                    </div>
                                    
                                    <div v-else class="size-fields">
                                        <div class="size-grid">
                                            <div class="input-group">
                                                <label class="input-label">Length (in)</label>
                                                <input type="number" v-model="form.length" class="form-input" placeholder="L" required>
                                            </div>
                                            <div class="input-group">
                                                <label class="input-label">Width (in)</label>
                                                <input type="number" v-model="form.width" class="form-input" placeholder="W" required>
                                            </div>
                                            <div class="input-group">
                                                <label class="input-label">Height (in)</label>
                                                <input type="number" v-model="form.height" class="form-input" placeholder="H" required>
                                            </div>
                                        </div>
                                        <div class="input-group">
                                            <label class="input-label">Quantity</label>
                                            <div class="qty-wrap d-flex align-items-center gap-3">
                                                <input type="number" v-model="form.qty" class="form-input" style="flex: 1;">
                                                <span v-if="cubes > 0" class="badge bg-teal-soft text-teal font-weight-bold" style="background: #f0fdfa; color: #0d9488; padding: 10px 15px; border-radius: 10px;">{{ cubes }} CFT</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="location-grid grid-2 mt-4">
                                        <div class="input-group">
                                            <label class="input-label">Origin Zip</label>
                                            <input type="text" v-model="form.originZip" class="form-input" placeholder="Zip Code" required>
                                        </div>
                                        <div class="input-group">
                                            <label class="input-label">Destination Zip</label>
                                            <input type="text" v-model="form.destZip" class="form-input" placeholder="Zip Code" required>
                                        </div>
                                    </div>

                                    <div class="input-group mt-4">
                                        <label class="input-label">Service Level</label>
                                        <select v-model="form.serviceLevelId" class="form-input">
                                            <option v-for="level in serviceLevels" :key="level.id" :value="level.id">
                                                {{ level.service_name }}
                                            </option>
                                        </select>
                                    </div>

                                    <button type="submit" class="btn-calculate" :disabled="loading">
                                        <span v-if="loading"><i class="fas fa-circle-notch fa-spin me-2"></i> Calculating...</span>
                                        <span v-else>Get Estimate</span>
                                    </button>

                                    <div class="text-center">
                                        <button type="button" @click="reset" class="btn-reset">Reset All Fields</button>
                                    </div>
                                </form>
                            </div>

                            <!-- Right: Result -->
                            <div class="result-side">
                                <div v-if="result" class="animate-fade">
                                    <span class="result-label">Estimated Total</span>
                                    <div class="result-value">${{ result.total }}</div>
                                    
                                    <div class="result-details">
                                        <div class="detail-line">
                                            <span class="key">Base Rate</span>
                                            <span class="val">${{ result.rate }} / unit</span>
                                        </div>
                                        <div class="detail-line">
                                            <span class="key">Availability</span>
                                            <span class="val" style="color: #059669;">Instant</span>
                                        </div>
                                        <p class="mt-3 text-muted small" style="font-style: italic; color: #94a3b8;">*{{ result.message || 'Rates are subject to fuel surcharge and taxes.' }}</p>
                                    </div>

                                    <Link :href="route('login')" class="btn-formal-quote">Get Formal Quote</Link>
                                </div>

                                <div v-else-if="error" class="error-state text-center">
                                    <div class="mb-4" style="font-size: 3rem; color: #ef4444;"><i class="fas fa-exclamation-circle"></i></div>
                                    <h3 class="font-weight-bold">Calculation Error</h3>
                                    <p class="text-muted">{{ error }}</p>
                                    <button @click="error = null" class="btn-reset">Try Again</button>
                                </div>

                                <div v-else class="empty-state text-center opacity-50">
                                    <div class="mb-4" style="font-size: 4rem; color: #cbd5e1;"><i class="fas fa-calculator"></i></div>
                                    <p class="font-weight-bold">Ready to Calculate</p>
                                    <p class="small">Fill in the details to see your instant estimate.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Bottom Info Section -->
            <section class="calculator-info-section">
                <div class="container">
                    <div class="info-grid reveal-on-scroll">
                        <div class="info-item">
                            <h4>Transparent Pricing</h4>
                            <p>No hidden fees. Our calculator uses real-time market data to give you the most accurate logistics estimate possible.</p>
                        </div>
                        <div class="info-item">
                            <h4>Global Network</h4>
                            <p>We cover all major shipping zones across Florida and beyond, ensuring your cargo reaches its destination efficiently.</p>
                        </div>
                        <div class="info-item">
                            <h4>Priority Handling</h4>
                            <p>Every shipment calculated here is eligible for our premium handling services, including white-glove delivery options.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </GuestLayout>
</template>

<style scoped>
/* Component logic and layout structure are now handled via guest-calculator.css */
.grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
}

@media (max-width: 768px) {
    .grid-2 {
        grid-template-columns: 1fr;
    }
}

.reveal-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.25, 1, 0.5, 1);
}

.reveal-on-scroll.is-visible {
    opacity: 1;
    transform: translateY(0);
}

.animate-fade {
    animation: fadeIn 0.6s ease-out forwards;
}

@keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
}
</style>

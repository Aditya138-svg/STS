<script setup>
import { computed, onMounted, ref } from 'vue'
import { Head, usePage, useForm } from '@inertiajs/vue3'
import GuestLayout from '@/Layouts/GuestLayout.vue'
import { useGuestAssets } from '@/composables/Guest'
import '../../../css/guest/guest-contact.css'

const page = usePage()
const { route, asset } = useGuestAssets()

const appName = computed(() => page.props.sts?.appName ?? 'STS')

// Company Details (Mailing)
const companyAddress1 = computed(() => page.props.sts?.companyAddress1 ?? '3518 Yellow Jacket Lane')
const companyAddress2 = computed(() => page.props.sts?.companyAddress2 ?? 'Southport, FL 32409')
const companyPhone = computed(() => page.props.sts?.companyPhone ?? '(850) 257-7059')
const companyEmail = computed(() => page.props.sts?.companyEmail ?? 'sgtechqa6@gmail.com')
const companyEmailT = computed(() => page.props.sts?.companyEmailT ?? 'sgtechqa6@gmail.com')
const companyLat = computed(() => page.props.sts?.companyLat ?? '30.312317')
const companyLng = computed(() => page.props.sts?.companyLng ?? '-85.604344')

// Warehouse Details
const warehouseAddress1 = computed(() => page.props.sts?.warehouseAddress1 ?? '17703 Ashley Drive Unit A8')
const warehouseAddress2 = computed(() => page.props.sts?.warehouseAddress2 ?? 'Panama City Beach, FL 32413')
const warehousePhone = computed(() => page.props.sts?.warehousePhone ?? '(850) 257-7059')
const serviceEmail = computed(() => page.props.sts?.serviceEmail ?? 'sgtechqa6@gmail.com')
const companyEmailE = computed(() => page.props.sts?.companyEmailE ?? 'sgtechqa6@gmail.com')
const warehouseLat = computed(() => page.props.sts?.warehouseLat ?? '30.237960')
const warehouseLng = computed(() => page.props.sts?.warehouseLng ?? '-85.903229')

const form = useForm({
    name: '',
    email: '',
    question: '',
    'g-recaptcha-response': ''
})

const isSuccess = computed(() => page.props.flash?.success ?? false)
const successMessage = computed(() => page.props.flash?.message ?? 'We will review your query and get back to you soon.')
const formSubmitted = ref(false)

const submit = () => {
    form.post(route('ask_question', undefined, false) || '/ask-question', {
        preserveScroll: true,
        onSuccess: () => {
            form.reset()
            formSubmitted.value = true
        }
    })
}

const newQuery = () => {
    formSubmitted.value = false;
    form.reset();
}

onMounted(() => {
    // Google Map Initialization
    const initMapConfig = () => {
        const mapEl = document.getElementById('googleMap')
        if(!mapEl) return

        const locations = [
            ['Florida', parseFloat(companyLat.value), parseFloat(companyLng.value), 1],
            ['Warehouse', parseFloat(warehouseLat.value), parseFloat(warehouseLng.value), 2]
        ]

        const map = new google.maps.Map(mapEl, {
            zoom: 7,
            center: { lat: parseFloat(companyLat.value), lng: parseFloat(companyLng.value) },
            mapTypeId: google.maps.MapTypeId.ROADMAP
        })

        const infowindow = new google.maps.InfoWindow()

        locations.forEach((loc) => {
            const marker = new google.maps.Marker({
                position: { lat: loc[1], lng: loc[2] },
                map: map
            })
            marker.addListener('click', () => {
                infowindow.setContent(loc[0])
                infowindow.open(map, marker)
            })
        })
    }

    window.initMap = initMapConfig;

    if (!window.google) {
        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyChxhntnizdIl4kmo6Dq8vkRMBGatGXSbE&callback=initMap`
        script.async = true
        script.defer = true
        document.head.appendChild(script)
    } else {
        initMapConfig()
    }

    // Scroll Reveal Observer
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
})
</script>

<template>
    <GuestLayout>
        <Head :title="`Contact — ${appName}`" />

        <div class="guest-home guest-contact-page">
            <!-- Hero Section -->
            <section class="contact-hero-section">
                <div class="container">
                    <div class="contact-hero-grid">
                        <div class="contact-hero-copy">
                            <p class="contact-hero-kicker">Get in Touch</p>
                            <h1 class="contact-hero-title">We're here to help you move forward.</h1>
                            <p class="contact-hero-lead">
                                Whether you have a question about our services, pricing, or specialized logistics, our team is standing by to provide expert assistance.
                            </p>
                        </div>
                        <div class="contact-hero-visual">
                            <img :src="asset('images/wp/Contact-us.svg')" alt="Contact Support" class="contact-hero-img">
                        </div>
                    </div>
                </div>
            </section>

            <!-- Info & Form Section -->
            <section class="contact-main-content">
                <div class="container">
                    <div class="contact-main-grid reveal-on-scroll">
                        <!-- Left: Info Cards -->
                        <div class="contact-info-side">
                            <div class="contact-visual-wrap mb-4">
                                <img :src="asset('images/wp/moving-sofa.jpg')" alt="Contact Us" class="contact-illustration" style="border-radius: 24px; box-shadow: 0 15px 35px rgba(0,0,0,0.1);">
                            </div>
                            <div class="info-cards-grid">
                                <div class="contact-card">
                                    <div class="card-icon-box"><i class="fa fa-envelope"></i></div>
                                    <div class="card-body">
                                        <h3>Email Support</h3>
                                        <p>Our team typically responds within 2 hours during business hours.</p>
                                        <a :href="`mailto:${companyEmail}`">{{ companyEmail }}</a>
                                    </div>
                                </div>
                                <div class="contact-card">
                                    <div class="card-icon-box"><i class="fa fa-phone"></i></div>
                                    <div class="card-body">
                                        <h3>Call Us</h3>
                                        <p>Speak directly with our logistics experts.</p>
                                        <a :href="`tel:${companyPhone}`">{{ companyPhone }}</a>
                                    </div>
                                </div>
                                <div class="contact-card">
                                    <div class="card-icon-box"><i class="fa fa-map-marker-alt"></i></div>
                                    <div class="card-body">
                                        <h3>Mailing Address</h3>
                                        <span>{{ companyAddress1 }}</span><br>
                                        <span>{{ companyAddress2 }}</span>
                                    </div>
                                </div>
                                <div class="contact-card">
                                    <div class="card-icon-box"><i class="fa fa-warehouse"></i></div>
                                    <div class="card-body">
                                        <h3>Warehouse</h3>
                                        <span>{{ warehouseAddress1 }}</span><br>
                                        <span>{{ warehouseAddress2 }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Right: Contact Form -->
                        <div class="contact-form-side">
                            <!-- Map Card -->
                            <div class="contact-map-card">
                                <div id="googleMap" style="width: 100%; height: 300px; border-radius: 20px;"></div>
                            </div>

                            <div class="contact-form-container">
                                <div v-if="formSubmitted || isSuccess" class="text-center py-4">
                                    <div class="success-icon mb-4">
                                        <i class="fa fa-check-circle text-success fa-4x"></i>
                                    </div>
                                    <h2 class="form-title">Thank You!</h2>
                                    <p class="form-subtitle">{{ successMessage }}</p>
                                    <button @click="newQuery" class="btn-submit">Submit Another Query</button>
                                </div>

                                <div v-else>
                                    <h2 class="form-title">Ask a Question</h2>
                                    <p class="form-subtitle">Fill out the form below and we'll be in touch shortly.</p>
                                    
                                    <form @submit.prevent="submit">
                                        <div class="form-group mb-4">
                                            <label for="name">Full Name</label>
                                            <input type="text" class="form-control" id="name" v-model="form.name" placeholder="Enter your name" required>
                                        </div>
                                        <div class="form-group mb-4">
                                            <label for="email">Email Address</label>
                                            <input type="email" class="form-control" id="email" v-model="form.email" placeholder="email@example.com" required>
                                        </div>
                                        <div class="form-group mb-4">
                                            <label for="question">Your Message</label>
                                            <textarea class="form-control" id="question" v-model="form.question" rows="4" placeholder="How can we help you?" required></textarea>
                                        </div>

                                        <button type="submit" class="btn-submit" :disabled="form.processing">
                                            <span v-if="form.processing"><i class="fas fa-circle-notch fa-spin me-2"></i> Sending...</span>
                                            <span v-else>Send Message</span>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    </GuestLayout>
</template>

<style scoped>
/* Scoped styles removed in favor of external guest-contact.css */
</style>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { Head, Link, usePage } from '@inertiajs/vue3'
import GuestLayout from '@/Layouts/GuestLayout.vue'
import { useGuestAssets } from '@/composables/Guest'
import '../../../css/guest/guest-home.css'

const page = usePage()
const { asset, route, christmasTheme } = useGuestAssets()

const appName = computed(() => page.props.sts?.appName ?? 'STS')

const activeFaq = ref(null)
const toggleFaq = (index) => {
    activeFaq.value = activeFaq.value === index ? null : index
}

const faqItems = [
    {
        question: "How can I track my shipment in real-time?",
        answer: "You can track your order easily by clicking the 'Track Your Order' button on our homepage and entering your tracking ID. We provide milestone updates as your cargo moves."
    },
    {
        question: "What types of logistics services do you provide?",
        answer: "STS offers a comprehensive range of services including designer logistics, specialty residential moving, meticulous packing, and white-glove delivery solutions."
    },
    {
        question: "How do I request a custom shipping quote?",
        answer: "Simply click the 'Request A Quote' button or navigate to our contact page. Our team will review your requirements and provide a tailored solution within 24 hours."
    },
    {
        question: "Do you offer international shipping services?",
        answer: "Yes, we provide end-to-end international logistics solutions, handling everything from documentation and customs clearance to final delivery across global networks."
    },
    {
        question: "Is my cargo insured during transportation?",
        answer: "We prioritize safety and security. All shipments are handled with extreme care, and we offer various insurance options to give you peace of mind throughout the journey."
    }
]

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
        <Head title="Home" />

        <div class="guest-home">
        <!-- Christmas: keep focused seasonal hero -->
        <div
            v-if="christmasTheme"
            class="container-fluid main-content home-page home-page--christmas"
            :style="christmasBgStyle"
        >
            <div class="home-christmas-inner">
                <div class="hero-section christmas-hero">
                    <div class="hero-inner">
                        <img :src="asset('images/christmas_logo_bg_rm.png')" class="img-responsive image1 hero-logo" alt="logo">
                        <p class="event-row"><img :src="asset('images/xmas-nyear.png')" class="event-img" alt="Merry Christmas"></p>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="main-content home-page">
            <section class="home-hero" aria-label="Introduction">
                <div class="home-hero-grid">
                    <div class="home-hero-copy">
                        <p class="hero-badge">
                            <i class="fa fa-shield" aria-hidden="true" />
                            <span>Trusted Logistics Partner</span>
                        </p>
                        <h1 class="hero-title">
                            Fast, Reliable &amp; Secure <span class="hero-title-accent">Logistics</span>
                        </h1>
                        <p class="hero-tagline">
                            End-to-end visibility and responsive support for freight that cannot afford surprises.
                        </p>
                    </div>

                    <div class="home-hero-visual">
                        <div class="hero-svg-card">
                            <img :src="asset('images/wp/home.svg')" alt="STS Logistics Illustration" class="hero-dynamic-svg">
                        </div>
                    </div>
                </div>
            </section>

            <section class="home-quick-actions-section reveal-on-scroll" aria-label="Quick actions">
                <div class="container quick-actions-container">
                    <div class="quick-actions-grid">
                        <Link :href="route('guest.track_order')" class="quick-card card-track">
                            <div class="card-icon-box">
                                <i class="fa fa-truck" aria-hidden="true" />
                            </div>
                            <div class="card-content">
                                <h3>Track Your Order</h3>
                                <p>Real-time tracking & updates</p>
                            </div>
                            <div class="card-arrow">
                                <i class="fa fa-arrow-right" aria-hidden="true" />
                            </div>
                        </Link>

                        <Link :href="route('guest.shipping_calculator')" class="quick-card card-calc">
                            <div class="card-icon-box">
                                <i class="fa fa-calculator" aria-hidden="true" />
                            </div>
                            <div class="card-content">
                                <h3>Shipping Calculator</h3>
                                <p>Get accurate shipping rates</p>
                            </div>
                            <div class="card-arrow">
                                <i class="fa fa-arrow-right" aria-hidden="true" />
                            </div>
                        </Link>

                        <Link :href="route('login')" class="quick-card card-quote">
                            <div class="card-icon-box">
                                <i class="fa fa-file-text" aria-hidden="true" />
                            </div>
                            <div class="card-content">
                                <h3>Request A Quote</h3>
                                <p>Get a custom quote</p>
                            </div>
                            <div class="card-arrow">
                                <i class="fa fa-arrow-right" aria-hidden="true" />
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            <section class="home-trust reveal-on-scroll" aria-label="Why customers choose us">
                <div class="container">
                    <ul class="trust-grid">
                        <li class="trust-item">
                            <div class="trust-icon-ring" aria-hidden="true">
                                <i class="fa fa-lock" />
                            </div>
                            <div class="trust-text">
                                <h3 class="trust-title">Secure &amp; Safe</h3>
                                <p class="trust-desc">Proven handling for high-value and designer residential freight.</p>
                            </div>
                        </li>
                        <li class="trust-item">
                            <div class="trust-icon-ring" aria-hidden="true">
                                <i class="fa fa-headphones" />
                            </div>
                            <div class="trust-text">
                                <h3 class="trust-title">Responsive Support</h3>
                                <p class="trust-desc">A team that answers when schedules and routes shift.</p>
                            </div>
                        </li>
                        <li class="trust-item">
                            <div class="trust-icon-ring" aria-hidden="true">
                                <i class="fa fa-history" />
                            </div>
                            <div class="trust-text">
                                <h3 class="trust-title">On-Time Mindset</h3>
                                <p class="trust-desc">Milestones and communication you can plan around.</p>
                            </div>
                        </li>
                        <li class="trust-item">
                            <div class="trust-icon-ring" aria-hidden="true">
                                <i class="fa fa-globe" />
                            </div>
                            <div class="trust-text">
                                <h3 class="trust-title">Deep Experience</h3>
                                <p class="trust-desc">Decades focused on designer and specialty commodities.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </section>

            <section class="home-about reveal-on-scroll" id="about-preview" aria-labelledby="home-about-heading">
                <div class="container">
                    <p class="about-kicker">Why Choose {{ appName }}?</p>
                    <h2 id="home-about-heading" class="about-heading">
                       Smarter shipping starts here.
                    </h2>

                    <div class="about-cards">
                        <Link :href="route('guest.about')" class="about-card">
                            <div class="about-card-img-wrap">
                                <img :src="asset('images/wp/Subtract-1.png')" alt="" class="about-card-img">
                                <span class="about-card-icon" aria-hidden="true"><i class="fa fa-building" /></span>
                            </div>
                            <div class="about-card-body">
                                <h3>Our Story</h3>
                                <p>Decades of transportation experience in designer and specialty residential logistics.</p>
                            </div>
                        </Link>
                        <Link :href="route('guest.about') + '#mission'" class="about-card">
                            <div class="about-card-img-wrap">
                                <img :src="asset('images/wp/our-mission-img.jpg')" alt="" class="about-card-img">
                                <span class="about-card-icon" aria-hidden="true"><i class="fa fa-bullseye" /></span>
                            </div>
                            <div class="about-card-body">
                                <h3>Our Mission</h3>
                                <p>Benchmark excellence—from antiques to full-home moves and custom crating.</p>
                            </div>
                        </Link>
                        <Link :href="route('guest.about') + '#values'" class="about-card">
                            <div class="about-card-img-wrap">
                                <img :src="asset('images/wp/image_2024_01_27T18_23_12_971Z.png')" alt="" class="about-card-img">
                                <span class="about-card-icon" aria-hidden="true"><i class="fa fa-heart" /></span>
                            </div>
                            <div class="about-card-body">
                                <h3>Our Values</h3>
                                <p>Ethical practice, transparency, and a culture built for long-term partnerships.</p>
                            </div>
                        </Link>
                    </div>

                    <div class="about-cta-row">
                        <Link :href="route('guest.about')" class="btn-about-more">
                            About Us
                            <i class="fa fa-long-arrow-right" aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            </section>

            <section class="home-faq reveal-on-scroll" id="faq" aria-labelledby="home-faq-heading">
                <div class="container">
                    <p class="faq-kicker">Got Questions?</p>
                    <h2 id="home-faq-heading" class="faq-heading">Frequently Asked Questions</h2>
                    
                    <div class="faq-layout-grid">
                        <div class="faq-visual">
                            <img :src="asset('images/wp/FAQs.svg')" alt="FAQs Illustration" class="faq-img">
                        </div>

                        <div class="faq-accordion">
                            <div 
                                v-for="(item, index) in faqItems" 
                                :key="index" 
                                class="faq-item"
                                :class="{ 'is-active': activeFaq === index }"
                            >
                                <button class="faq-question" @click="toggleFaq(index)" :aria-expanded="activeFaq === index">
                                    <span>{{ item.question }}</span>
                                    <span class="faq-icon">
                                        <i :class="['fa', activeFaq === index ? 'fa-minus' : 'fa-plus']" />
                                    </span>
                                </button>
                                <div class="faq-answer-wrapper" v-show="activeFaq === index">
                                    <div class="faq-answer">
                                        <p>{{ item.answer }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        </div>
    </GuestLayout>
</template>

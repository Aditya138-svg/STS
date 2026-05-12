<script setup>
import { computed, onMounted } from 'vue'
import { Head, usePage } from '@inertiajs/vue3'
import GuestLayout from '@/Layouts/GuestLayout.vue'
import { useGuestAssets } from '@/composables/Guest'
import '../../../css/guest/guest-about.css'

const page = usePage()
const { asset, route } = useGuestAssets()
const appName = computed(() => page.props.sts?.appName ?? 'STS')

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
        <Head :title="`About — ${appName}`" />

        <div class="guest-home guest-about-page">
            <header class="about-hero-section">
                <div class="container">
                    <div class="about-hero-grid">
                        <div class="about-hero-copy">
                            <p class="about-hero-kicker">Our Legacy</p>
                            <h1 class="about-hero-title">Delivering Trust & Excellence Since 1974</h1>
                            <p class="about-hero-lead">We simplify logistics complexities with tailored strategies, resolving challenges and ensuring seamless delivery for local and international needs.</p>
                            
                            <div class="about-hero-actions">
                                <Link :href="route('guest.track_order')" class="btn-about-hero">Start Tracking</Link>
                                <div class="about-hero-badges">
                                    <span class="about-badge">Expertise</span>
                                    <span class="about-badge">Reliability</span>
                                    <span class="about-badge">Experience</span>
                                </div>
                            </div>
                        </div>

                        <div class="about-hero-visual">
                            <div class="about-visual-container">
                                <div class="about-visual-shape"></div>
                                <img :src="asset('images/wp/About-us.svg')" alt="About STS" class="about-main-img">
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div class="about-content-wrapper">
                <!-- Section: Mission -->
                <section id="mission" class="about-info-section section-mission reveal-on-scroll">
                    <div class="container">
                        <div class="about-info-grid">
                            <div class="about-info-visual">
                                <div class="visual-accent-shape shape-left"></div>
                                <img :src="asset('images/wp/our-mission-img.jpg')" alt="Our Mission" class="info-main-img">
                            </div>
                            <div class="about-info-copy">
                                <p class="info-kicker">Our Purpose</p>
                                <h2 class="info-title">Our Mission</h2>
                                <p class="info-text">Whether it's the meticulous packing of a cherished antique, handling the entire contents of a home, or creating secure crates for unique custom items, STS has set a benchmark of excellence that stands unmatched in the industry.</p>
                                <p class="info-text">We take immense pride in pioneering innovative solutions for all your needs, ensuring that every shipment is handled with the precision and care it deserves.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Section: Values -->
                <section id="values" class="about-info-section section-values reveal-on-scroll">
                    <div class="container">
                        <div class="about-info-grid grid-reverse">
                            <div class="about-info-copy">
                                <p class="info-kicker">Our Foundation</p>
                                <h2 class="info-title">Our Values</h2>
                                <p class="info-text">At STS, we've nurtured a culture that prioritizes ethical business practices. These values serve as our guiding principles, shaping our identity as individuals and as an organization.</p>
                                <p class="info-text">Our fundamental values not only influence our daily operations but also set us apart, giving us a competitive edge in the global logistics market.</p>
                            </div>
                            <div class="about-info-visual">
                                <div class="visual-accent-shape shape-right"></div>
                                <img :src="asset('images/wp/image_2024_01_27T18_23_12_971Z.png')" alt="Our Values" class="info-main-img">
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Section: Principles Grid -->
                <section class="about-principles-section reveal-on-scroll">
                    <div class="container">
                        <div class="principles-grid">
                            <div class="principle-card">
                                <div class="principle-card-img-wrap">
                                    <img :src="asset('images/wp/moving-sofa.jpg')" alt="Willingness" class="principle-img">
                                </div>
                                <div class="principle-card-body">
                                    <h3>Willingness</h3>
                                    <p>We are always prepared and eager to go the extra mile in serving our customers. Moreover, our readiness extends internally as we support the growth and success of new employees and partners.</p>
                                </div>
                            </div>
                            <div class="principle-card">
                                <div class="principle-card-img-wrap">
                                    <img :src="asset('images/wp/image_2024_01_27T18_25_32_023Z.png')" alt="Sincerity" class="principle-img">
                                </div>
                                <div class="principle-card-body">
                                    <h3>Sincerity</h3>
                                    <p>Our commitment is to operate with honesty, transparency, and utmost respect for our customers, employees, and carrier partners.</p>
                                </div>
                            </div>
                            <div class="principle-card">
                                <div class="principle-card-img-wrap">
                                    <img :src="asset('images/wp/image_2024_01_27T18_26_40_547Z-1.png')" alt="Innovative" class="principle-img">
                                </div>
                                <div class="principle-card-body">
                                    <h3>Innovative</h3>
                                    <p>Continuous process improvement is ingrained in our DNA. Moreover, being innovative means taking action, introducing fresh ideas, embracing calculated risks, and swiftly learning from them.</p>
                                </div>
                            </div>
                            <div class="principle-card">
                                <div class="principle-card-img-wrap">
                                    <img :src="asset('images/wp/image_2024_01_27T18_22_50_858Z-1.png')" alt="Empowerment" class="principle-img">
                                </div>
                                <div class="principle-card-body">
                                    <h3>Empowerment</h3>
                                    <p>We are dedicated to achieving excellence in our relationships with showrooms, customers, and employees.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </GuestLayout>
</template>

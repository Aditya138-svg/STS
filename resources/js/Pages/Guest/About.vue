<script setup>
import { computed } from 'vue'
import { Head, usePage } from '@inertiajs/vue3'
import GuestLayout from '@/Layouts/GuestLayout.vue'
import { useGuestAssets } from '@/composables/Guest'

const page = usePage()
const { asset } = useGuestAssets()
const appName = computed(() => page.props.sts?.appName ?? 'STS')
</script>

<template>
    <GuestLayout>
        <Head :title="`About — ${appName}`" />

        <header class="entry-header about-header">
            <h1 class="entry-title">ABOUT US</h1>
        </header>
        <div class="secondabout">
            <div class="container">
                <div class="row about-first-div">
                    <div class="col-lg-6 col-md-6 col-12">
                        <h2 class="main-heading">About Us</h2>
                        <h4>Committed to Quality and Delivery Excellence</h4>
                        <h6>Company History</h6>
                        <p>Drawing from our over 30 years of furniture experience in the design industry, the management team has a combined 60 years of transportation experience specifically in the Designer and Special Commodities residential industry. After successfully owning and operating a multi-facility operation on the West Coast specializing on over 150 residential deliveries per day for some of the most elite designers and workrooms, the management team has undergone an acquisition that put their ability to bring their expertise to the beautiful state of Florida. After being backed with a high level of experience and a solid understanding of what the design trade needs, STS management is committed to the delivery experience and professionalism that is expected in this industry. Over the years, {{ appName }} has adapted to numerous shifts in the market. Furthermore, we have upheld our commitment to customer service and punctual deliveries. Consequently, our success has been guided by industry insights, innovation, and unwavering determination. This positioning has made us a robust organization ready to tackle any challenge. Most importantly, our team members have built a reputation for delivering exceptional quality and operational excellence.</p>

                        <p>{{ appName }} – Ensuring on-time and successful deliveries for over 50 years!.</p>

                    </div>
                    <div class="col-lg-6 col-md-6 col-12">
                        <div class="about-img-div">
                            <img class="img-about" :src="asset('images/wp/Subtract-1.png')" alt="About us">
                            <div class="counter-img-div">
                                <img :src="asset('images/wp/Rectangle-77.png')" alt="img-2">
                                <div class="counterbox">
                                    <span class="color-counter">50+</span>
                                    <span>Years of experience</span>
                                </div>
                                <div class="counterbox">
                                    <span class="color-counter color-487BAB">2452</span>
                                    <span>Happy Clients</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row mission-div">
                    <div class="col-lg-6 col-md-6 col-12">
                        <img :src="asset('images/wp/our-mission-img.jpg')" alt="mission-img">
                    </div>

                    <div class="col-lg-6 col-md-6 col-12">
                        <div class="mission-textbox">
                            <h3>Our Mission</h3>
                            <p>Whether it's the meticulous packing and unpacking of a cherished antique, handling the entire contents of a home, or creating secure crates for unique custom furniture items, {{ appName }} has set a benchmark of excellence that stands unmatched in the industry. We take immense pride in pioneering innovative solutions for all your needs.</p>
                        </div>
                    </div>
                </div>

                <div class="row mission-div values-div">
                    <div class="col-lg-6 col-md-6 col-12">
                        <div class="right-mission-textbox">
                            <h3>Our Values</h3>
                            <p>At {{ appName }}, we've nurtured a culture that prioritizes ethical business practices. These values serve as our guiding principles, shaping our identity as individuals and as an organization. These four fundamental values not only influence our daily operations but also set us apart. Consequently, they give us a competitive edge. It's worth noting that those who do not wholeheartedly embrace these values do not find a long-term place within our team.</p>
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-6 col-12">
                        <img :src="asset('images/wp/image_2024_01_27T18_23_12_971Z.png')" alt="mission-img">
                    </div>
                </div>

                <div class="row services-div">
                    <div class="col-lg-3 col-md-3 col-6">
                        <img :src="asset('images/wp/moving-sofa.jpg')" alt="service-1">
                        <h3>Willingness</h3>
                        <p>We are always prepared and eager to go the extra mile in serving our customers. Moreover, our readiness extends internally as we support the growth and success of new employees and partners.</p>
                    </div>
                    <div class="col-lg-3 col-md-3 col-6">
                        <img :src="asset('images/wp/image_2024_01_27T18_25_32_023Z.png')" alt="service-1">
                        <h3>Sincerity</h3>
                        <p>Our commitment is to operate with honesty, transparency, and utmost respect for our customers, employees, and carrier partners.</p>
                    </div>
                    <div class="col-lg-3 col-md-3 col-6">
                        <img :src="asset('images/wp/image_2024_01_27T18_26_40_547Z-1.png')" alt="service-1">
                        <h3>Innovative</h3>
                        <p>Continuous process improvement is ingrained in our DNA. Moreover, being innovative means taking action, introducing fresh ideas, embracing calculated risks, and swiftly learning from them.</p>
                    </div>
                    <div class="col-lg-3 col-md-3 col-6">
                        <img :src="asset('images/wp/image_2024_01_27T18_22_50_858Z-1.png')" alt="service-1">
                        <h3>Empowerment</h3>
                        <p>We are dedicated to achieving excellence in our relationships with showrooms, customers, and employees.</p>
                    </div>
                </div>
            </div>
        </div>
    </GuestLayout>
</template>

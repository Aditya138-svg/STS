<script setup>
import { computed } from 'vue'
import { Head } from '@inertiajs/vue3'
import GuestLayout from '@/Layouts/GuestLayout.vue'
import { useGuestAssets } from '@/composables/Guest'

const { asset, route, christmasTheme } = useGuestAssets()

const homeStyle = computed(() => {
    if (christmasTheme.value) {
        return { backgroundImage: `url(${asset('images/homebackground_christmas.jpg')})` }
    }
    return { backgroundImage: `url(${asset('images/wp/BG2.jpg')})` }
})
</script>

<template>
    <GuestLayout>
        <Head title="Home" />
        <div class="container-fluid main-content home-content" :style="homeStyle">
            <template v-if="christmasTheme">
                <img :src="asset('images/christmas_logo_bg_rm.png')" class="img-responsive image1" alt="logo">
                <p class="event-row"><img :src="asset('images/xmas-nyear.png')" class="event-img" alt="Merry Christmas"></p>
            </template>
            <template v-else>
                <img :src="asset('images/logo.png')" class="img-responsive image1 container-logo" alt="logo">
            </template>

            <div class="container home-info">
                <div class="row">
                    <div class="col-md-4 service">
                        <a :href="route('guest.shipping_calculator')"><i class="fa fa-2x fa-calculator calcu"></i></a>
                        <a :href="route('guest.shipping_calculator')"><p>Calculate your shipping amount</p></a>
                    </div>
                    <div class="col-md-4 service">
                        <a :href="route('guest.track_order')"><i class="fa fa-2x fa-truck"></i></a>
                        <a :href="route('guest.track_order')"><p>Track your order anytime</p></a>
                    </div>
                    <div class="col-md-4 service">
                        <a :href="route('guest.create_quote')"><i class="fa fa-2x fa-file-text" aria-hidden="true"></i></a>
                        <a :href="route('guest.create_quote')"><p>Request Quote</p></a>
                    </div>
                </div>
            </div>
        </div>
    </GuestLayout>
</template>

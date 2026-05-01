<script setup>
import { computed } from 'vue'
import { usePage } from '@inertiajs/vue3'
import { useGuestAssets } from '@/composables/Guest'

const page = usePage()
const { asset, sts } = useGuestAssets()
const year = new Date().getFullYear()
const copyrightText = computed(() => page.props.sts?.footer?.copyright ?? `Copyright (c) 2025${year !== 2025 ? ` - ${year}` : ''} ${page.props.sts?.appName ?? ''}`)
</script>

<template>
    <footer class="guest-footer-bar">
        <div class="container-fluid guest-footer-wrap">
            <div class="guest-footer-left">
                <p class="guest-footer-copy"><strong>{{ copyrightText }}</strong></p>
                <ul class="list-inline footer-links">
                    <li><a href="#">Florida Schedule</a></li>
                    <li>|</li>
                    <li><a href="#">FAQs</a></li>
                    <li>|</li>
                    <li><a href="#">Terms & Conditions</a></li>
                    <li>|</li>
                    <li><a href="#">Privacy Policy</a></li>
                    <li>|</li>
                    <li><a href="#">STS Info</a></li>
                    <li>
                        <a href="#" class="btn btn-primary btn-sm"><i class="fa fa-comments" aria-hidden="true" /> Feedback</a>
                    </li>
                </ul>
            </div>
            <div class="guest-footer-mid">
                <span class="guest-footer-label"><strong>Accepted Cards:</strong></span>
                <img alt="logo" class="guest-footer-cards" :src="asset('images/paym.jpg')">
            </div>
            <div class="guest-footer-right">
                <p>All rights reserved.</p>
                <div class="guest-footer-social">
                    <a target="_blank" :href="sts.social?.facebook"><i class="fab fa-2x fa-facebook-square" /></a>
                    <a target="_blank" :href="sts.social?.instagram"><i class="fab fa-2x fa-square-instagram" /></a>
                    <a target="_blank" :href="sts.social?.x_twitter"><i class="fab fa-2x fa-square-x-twitter" /></a>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup>
import { computed } from 'vue'
import { usePage } from '@inertiajs/vue3'
import { useGuestAssets } from '@/composables/Guest'

const page = usePage()
const { sts } = useGuestAssets()
const lastLogin = computed(() => page.props.auth?.user?.last_login_display ?? null)
</script>

<template>
    <div>
        <div v-if="lastLogin" class="top-bar">
            <div class="container">
                <p>Last Login at: <span>{{ lastLogin }}</span></p>
            </div>
        </div>
        <div class="top-header">
            <div class="container">
                <div class="main-top-header">
                    <div class="left-header-div">
                        <ul class="mail-number-div">
                            <li>
                                <i class="fa fa-phone" aria-hidden="true" />
                                <span>{{ sts.warehousePhone }}</span>
                            </li>
                            <li>
                                <i class="fa fa-envelope" aria-hidden="true" />
                                <span>{{ sts.scheduleEmail }}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="right-header-div">
                        <ul class="social-icons-div">
                            <li><a :href="sts.social?.facebook"><i class="fab fa-facebook" aria-hidden="true" /></a></li>
                            <li><a :href="sts.social?.instagram"><i class="fab fa-instagram" aria-hidden="true" /></a></li>
                            <li><a :href="sts.social?.x_twitter"><i class="fab fa-square-x-twitter" aria-hidden="true" /></a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

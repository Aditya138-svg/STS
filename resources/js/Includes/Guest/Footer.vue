<script setup>
import { computed } from 'vue'
import { usePage, Link } from '@inertiajs/vue3'
import { useGuestAssets } from '@/Composables/Guest'

const page = usePage()
const { asset, sts, route } = useGuestAssets()
const year = new Date().getFullYear()
const copyrightText = computed(() => page.props.sts?.footer?.copyright ?? `Copyright © ${year} ${page.props.sts?.appName ?? 'STS Transport'}`)
</script>

<template>
    <footer class="guest-footer">
        <div class="container guest-footer-wrap">
            <div class="footer-main-row">
                <!-- Left Side: Identity & Navigation -->
                <div class="footer-left">
                    <p class="copyright-text">{{ copyrightText }}</p>
                    <nav class="footer-nav">
                        <Link :href="route('guest.home')" class="footer-link">Home</Link>
                        <span class="separator">•</span>
                        <Link :href="route('terms')" class="footer-link">Terms</Link>
                        <span class="separator">•</span>
                        <Link :href="route('privacy')" class="footer-link">Privacy</Link>
                        
                        <a v-if="sts.footer?.feedback_href" :href="sts.footer.feedback_href" class="feedback-pill">
                            <i class="fa fa-comments" /> Feedback
                        </a>
                    </nav>
                </div>

                <!-- Right Side: Trust & Social -->
                <div class="footer-right">
                    <div class="footer-group">
                        <span class="group-label">Secure Payments</span>
                        <div class="payment-cards">
                            <img alt="Accepted Payments" class="cards-img" :src="asset('images/paym.jpg')">
                        </div>
                    </div>
                    <div class="footer-group">
                        <span class="group-label">Connectivity</span>
                        <div class="social-links">
                            <a target="_blank" :href="sts.social?.facebook" class="social-icon icon-facebook" title="Facebook">
                                <i class="fab fa-facebook-f" />
                            </a>
                            <a target="_blank" :href="sts.social?.instagram" class="social-icon icon-instagram" title="Instagram">
                                <i class="fab fa-instagram" />
                            </a>
                            <a target="_blank" :href="sts.social?.x_twitter" class="social-icon icon-twitter" title="Twitter/X">
                                <i class="fab fa-x-twitter" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>© {{ year }} STS Transport. All rights reserved.</p>
            </div>
        </div>
    </footer>
</template>

<style scoped>
.guest-footer {
    background-color: #f8fafc !important;
    padding: 60px 0 30px;
    color: #64748b;
    border-top: 1px solid #e2e8f0;
    position: relative;
}

.guest-footer::before {
    content: '';
    position: absolute;
    top: -1px;
    left: 0;
    right: 0;
    height: 1px;
    background: #0d9488;
}

.guest-footer-wrap {
    max-width: 980px; /* Reduced width to match navbar */
    margin: 0 auto;
    padding: 0 20px;
}

.footer-main-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 40px;
    margin-bottom: 40px;
}

.footer-left {
    flex: 1;
}

.copyright-text {
    font-size: 1.15rem;
    font-weight: 900;
    color: #0f172a;
    margin-bottom: 12px;
    letter-spacing: -0.01em;
}

.footer-nav {
    display: flex;
    align-items: center;
    gap: 15px;
    flex-wrap: wrap;
}

.footer-link {
    font-size: 14px;
    font-weight: 700;
    color: #64748b;
    text-decoration: none;
    transition: all 0.2s ease;
}

.footer-link:hover {
    color: #0d9488;
}

.separator {
    color: #cbd5e1;
    font-size: 10px;
}

.feedback-pill {
    background-color: #f0fdfa;
    color: #0d9488;
    padding: 5px 14px;
    border-radius: 100px;
    font-size: 12px;
    font-weight: 800;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-left: 5px;
    border: 1px solid #ccfbf1;
    transition: all 0.2s ease;
}

.feedback-pill:hover {
    background-color: #0d9488;
    color: #ffffff;
    transform: translateY(-1px);
}

.footer-right {
    display: flex;
    gap: 50px;
    text-align: right;
}

.footer-group {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.group-label {
    font-size: 11px;
    font-weight: 800;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 12px;
}

.cards-img {
    height: 24px;
    width: auto;
    filter: grayscale(0.4) opacity(0.7);
    transition: all 0.3s ease;
}

.cards-img:hover {
    filter: grayscale(0) opacity(1);
}

.social-links {
    display: flex;
    gap: 12px;
}

.social-icon {
    font-size: 16px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: #ffffff;
    color: #64748b;
    border: 1px solid #e2e8f0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    text-decoration: none;
}

.social-icon:hover {
    transform: translateY(-3px);
    color: #ffffff;
    background: #0d9488;
    border-color: #0d9488;
    box-shadow: 0 4px 10px rgba(13, 148, 136, 0.2);
}

.footer-bottom {
    padding-top: 25px;
    border-top: 1px solid #e2e8f0;
    text-align: center;
}

.footer-bottom p {
    font-size: 12px;
    color: #94a3b8;
    font-weight: 600;
}

@media (max-width: 900px) {
    .footer-main-row {
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 30px;
    }
    
    .footer-right {
        flex-direction: column;
        align-items: center;
        gap: 30px;
        text-align: center;
    }
    
    .footer-group {
        align-items: center;
    }

    .footer-nav {
        justify-content: center;
    }
    
    .feedback-pill {
        margin: 10px 0 0;
    }
}
</style>

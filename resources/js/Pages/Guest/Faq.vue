<script setup>
import { ref } from 'vue'
import { Head, Link } from '@inertiajs/vue3'
import GuestLayout from '@/Layouts/GuestLayout.vue'
import { useGuestAssets } from '@/Composables/Guest'

const { route } = useGuestAssets()

const faqs = ref([
    {
        question: "How can I track my order?",
        answer: "You can track your order using your Order ID or PO Number and Delivery Phone on our 'Track Your Order' page. Real-time updates are provided as your cargo moves through our network."
    },
    {
        question: "What service areas do you cover?",
        answer: "We primarily operate in Florida but offer logistics solutions across multiple zones. Please visit our 'Service Areas' page for a detailed map and list of locations."
    },
    {
        question: "How do I request a quote?",
        answer: "Simply use our Shipping Calculator to get an instant estimate, or click on the 'Contact Us' button to request a detailed corporate quote from our logistics team."
    },
    {
        question: "What are your hours of operation?",
        answer: "Our warehouses operate 24/7 for logistics processing, while our office support is available Monday through Friday from 8:00 AM to 6:00 PM EST."
    },
    {
        question: "Do you offer white-glove delivery?",
        answer: "Yes, we offer various service levels including standard dock-to-dock, inside delivery, and full white-glove setup depending on your specific requirements."
    }
])

const activeIndex = ref(null)

const toggleFaq = (index) => {
    activeIndex.value = activeIndex.value === index ? null : index
}
</script>

<template>
    <GuestLayout>
        <Head title="Frequently Asked Questions" />
        
        <div class="faq-page">
            <div class="container">
                <div class="faq-header text-center">
                    <h1>Frequently Asked Questions</h1>
                    <p>Everything you need to know about STS Transport services.</p>
                </div>

                <div class="faq-container">
                    <div 
                        v-for="(faq, index) in faqs" 
                        :key="index" 
                        class="faq-item"
                        :class="{ active: activeIndex === index }"
                    >
                        <button class="faq-question" @click="toggleFaq(index)" :aria-expanded="activeIndex === index">
                            <span class="q-text">{{ faq.question }}</span>
                            <div class="icon-box">
                                <i class="fas fa-chevron-down"></i>
                            </div>
                        </button>
                        
                        <div class="faq-answer-wrapper" :class="{ open: activeIndex === index }">
                            <div class="faq-answer-inner">
                                <div class="faq-answer-content">
                                    <p>{{ faq.answer }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="faq-footer text-center mt-5">
                    <div class="footer-card">
                        <h3>Still have questions?</h3>
                        <p>We're here to help. Contact our support team today.</p>
                        <Link :href="route('guest.contact')" class="btn-contact">Get in Touch</Link>
                    </div>
                </div>
            </div>
        </div>
    </GuestLayout>
</template>

<style scoped>
.faq-page {
    padding: 160px 0 100px;
    background-color: #ffffff;
    min-height: 100vh;
}

.faq-header {
    margin-bottom: 70px;
}

.faq-header h1 {
    font-size: 3rem;
    font-weight: 900;
    color: #0f172a;
    margin-bottom: 15px;
    letter-spacing: -0.02em;
}

.faq-header p {
    color: #64748b;
    font-size: 1.2rem;
    font-weight: 500;
}

.faq-container {
    max-width: 850px;
    margin: 0 auto;
}

.faq-item {
    background: #ffffff;
    border-radius: 20px;
    margin-bottom: 20px;
    border: 1px solid #f1f5f9;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
}

.faq-item:hover {
    border-color: #0d9488;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.05);
}

.faq-item.active {
    border-color: #0d9488;
    box-shadow: 0 20px 25px -5px rgba(13, 148, 136, 0.1);
}

.faq-question {
    width: 100%;
    padding: 24px 30px;
    background: none;
    border: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    text-align: left;
}

.q-text {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1e293b;
    transition: color 0.3s ease;
}

.faq-item.active .q-text {
    color: #0d9488;
}

.icon-box {
    width: 36px;
    height: 36px;
    background: #f8fafc;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
    transition: all 0.3s ease;
}

.faq-item.active .icon-box {
    background: #0d9488;
    color: #ffffff;
    transform: rotate(180deg);
}

/* Modern Smooth Grid Animation */
.faq-answer-wrapper {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.faq-answer-wrapper.open {
    grid-template-rows: 1fr;
}

.faq-answer-inner {
    overflow: hidden;
}

.faq-answer-content {
    padding: 0 30px 30px;
    color: #475569;
    font-size: 1.1rem;
    line-height: 1.7;
}

.faq-footer {
    margin-top: 80px;
}

.footer-card {
    background: #f8fafc;
    padding: 50px;
    border-radius: 30px;
    border: 1px solid #f1f5f9;
}

.footer-card h3 {
    font-size: 1.8rem;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 10px;
}

.btn-contact {
    display: inline-block;
    background: #0d9488;
    color: #ffffff;
    padding: 16px 40px;
    border-radius: 14px;
    font-weight: 700;
    font-size: 1.1rem;
    text-decoration: none;
    margin-top: 25px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 14px 0 rgba(13, 148, 136, 0.39);
}

.btn-contact:hover {
    background: #0b7a6f;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(13, 148, 136, 0.45);
}

@media (max-width: 768px) {
    .faq-page {
        padding: 120px 20px 60px;
    }
    
    .faq-header h1 {
        font-size: 2.2rem;
    }
    
    .q-text {
        font-size: 1.1rem;
    }
    
    .faq-question {
        padding: 20px;
    }
    
    .footer-card {
        padding: 30px 20px;
    }
}
</style>

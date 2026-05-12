<script setup>
import AuthLayout from '@/Layouts/AuthLayout.vue'
import { Head } from '@inertiajs/vue3'
import { useGuestAssets } from '@/composables/Guest'

const { asset } = useGuestAssets()
</script>

<template>
    <AuthLayout authImage="terms.svg">
        <Head title="Terms and Conditions" />

        <div class="legal-page">
            <h1 class="auth-title">Terms and Conditions</h1>
            <p class="legal-intro">
                It is understood and agreed that any and all work performed here forward by STS Delivery (THE COMPANY) are subject to the following terms and conditions:
            </p>

            <div class="legal-section">
                <h2>LIABILITY OF COMPANY</h2>
                <div class="legal-text">
                    <p>(a) The liability of THE COMPANY is limited to $0.60 per pound per article & in no event shall THE COMPANY be liable or responsible for any loss or damage due to any other causes other than THE COMPANY'S own negligence.</p>
                    <p>(b) THE COMPANY is not responsible for injury or damage to any fragile articles (articles susceptible to breakage or crushing), including but not limited to granite, glass, ceramic, marble, table tops, artwork, and mirrors.</p>
                    <p>(c) THE COMPANY will not be liable for loss or damage caused by ordinary wear and tear, leakage, mold, mildew, termites, rodents, vermin, moths, and other insects, rust, fumigation, heat, change in temperature, or other atmospheric conditions, natural deterioration, inherent vice or defect of the property, de-lamination of laminate or veneer furniture or damage to press board/particle board, manufacturer defects, poor construction or assembly, preexisting damage or loss damage or delay contributed to or caused by the act or omissions of the Customer or by acts of war, terrorism, insurrection, nuclear fusion, strikes, labor disturbances, fire, riots, or by any acts of God, or any cause beyond the Company's control, nor for loss or damage to items that are not packed, transported or unpacked by anyone other than employees of THE COMPANY.</p>
                    <p>(d) THE COMPANY is not responsible for mechanical or electrical malfunction of, nor for damage or injury to the internal functioning of any article, such as, but not limited to computers/computer equipment, pianos, electronics, electromechanical devices, instruments or appliances, whether or not such articles are packed or unpacked or stored or transported by THE COMPANY.</p>
                    <p>(e) THE COMPANY shall not be responsible for loss or damage to any pieces, furniture or other items, which are loaded (e.g. drawers, shelves, etc) nor to articles contained in drawers or in packages, cases, or containers not packed or unpacked by THE COMPANY.</p>
                    <p>(f) There shall be no liability on the part of THE COMPANY for property or residential damage due to restricted access at either origin or delivery, nor for property or residential damage when handling bulky items within restricted areas, such as, but not limited to pianos, organs, appliances, sofas, bookcases, dressers, desks, chairs, armoires, and over-sized pieces.</p>
                    <p>(g) THE COMPANY will not be liable for any damage to items loaded or unloaded into a rental truck or container, or a self-storage unit.</p>
                    <p>(h) The Company is able to install items on-site to the best of their ability with limited liability. STS Delivery cannot be responsible in any way for replacement value of any and all items installed and/or hung and/or other items damaged.</p>
                    <p>(i) THE COMPANY, cannot be responsible for time lost, future sales, or professional compensation. THE COMPANY cannot be responsible in any way for any and all damage and/or issues that occur due to improper hanging and/or installation of items.</p>
                </div>
            </div>

            <div class="legal-section">
                <ol class="legal-list">
                    <li>
                        <strong>CLAIMS:</strong> It is expressly agreed that all claims must be submitted in writing, with two (2) customer estimates /appraisals for repair within 30 days from the date of delivery. Payment in full of all charges due and owing is a condition precedent to submission of a claim. Any and all claimed loss or damage must be noted at the time of delivery. It is the customer's responsibility to be able to provide a current appraisal or receipt for the item(s) being shipped in order to show proof of value. The appraisal must be less than one year old. Proof of value must exist and be available prior to shipping. THE COMPANY shall only be responsible for damage in the amount of $0.60 per pound per article if no additional coverage has been selected at time of order acceptance.
                    </li>
                    <li>
                        <strong>CUSTOMER'S RESPONSIBILITIES AND LIABILITIES:</strong> (a) The participation in the performance of any of the services to be performed by THE COMPANY by the customer or any of their friends, relatives, invitees, employees or representatives is expressly at the customer's own risk, and specifically releases and agrees to fully indemnify THE COMPANY from any and all liability for injuries sustained to any of said persons.
                    </li>
                    <li>
                        <strong>CUSTOMER'S ACKNOWLEDGEMNT:</strong> The customer has represented and warranted to THE COMPANY that he/she has lawful possession of, and legal right, interest and authority to lender all of the property herein described.
                    </li>
                    <li>
                        <strong>SPECIAL CIRCUMSTANCE:</strong> The customer shall arrange in advance for all necessary elevators, loading dock, ingress/egress and/or other services.
                    </li>
                    <li>
                        <strong>MODIFICATION OF POLICY TERMS AND CONDITIONS:</strong> THE COMPANY reserves the right to modify the terms and conditions of this agreement after thirty days written notice to the customer.
                    </li>
                    <li>
                        <strong>RECEIVING:</strong> a) THE COMPANY receiving inspection is limited to obvious and blatant damage only. b) COD deliveries to our warehouse without appropriate "Receiving" paperwork may be refused. c) Any freight damage claims are between the carrier, manufacturer, and the customer.
                    </li>
                    <li>
                        <strong>INSURANCE:</strong> a) The customer can/should carry or obtain insurance to cover all items in storage. b) No merchandise will be released from THE COMPANY'S custody or control until all charges are paid in full.
                    </li>
                    <li>
                        <strong>STORAGE:</strong> Items in THE COMPANY’s possession default to storage at a rate of five dollars ($5.00) per order per day after ten (10) days unless a contractual agreement supersedes this clause.
                    </li>
                    <li>
                        <strong>STORAGE IN TRANSIT:</strong> Orders held in THE COMPANY possession due to no fault of THE COMPANY are subject to a storage in transit fee of five dollars ($5.00) per day per order.
                    </li>
                    <li>
                        <strong>THE COMPANY'S LIEN:</strong> (a) THE COMPANY shall have a lien against any and all property tendered to it for all charges incurred. (b) All goods upon which THE COMPANY has a lien, are subject to sale at public auction to satisfy any and all unpaid charges.
                    </li>
                    <li>
                        <strong>CHARGES:</strong> All charges will be based on THE COMPANY'S Rates, which is subject to change from time to time without notice.
                    </li>
                    <li>
                        <strong>FORFEITURE OF DISCOUNT:</strong> All rates specified include a twenty percent (20%) tariff discount.
                    </li>
                    <li>
                        <strong>CHOICE OF LAW:</strong> This agreement shall be governed by California law and any causes of action brought pertaining to this agreement shall be brought in State Court in Santa Clara, California.
                    </li>
                    <li>
                        <strong>ACKNOWLEDGEMENT:</strong> THE COMPANY and the customer acknowledge our policy and rate forms and the terms mentioned herein on any and all work performed by THE COMPANY.
                    </li>
                    <li>
                        <strong>LOCATION SERVICES:</strong> The STS Driver App needs your permission to track your location while you are logged in. This will mean that while you are delivering package so customer can easily track their order.
                    </li>
                    <li>
                        <strong>BACKGROUND LOCATION SERVICES:</strong> The STS Driver Mobile Application needs your permission to track your location when your application is in background mode.
                    </li>
                </ol>
            </div>
        </div>
    </AuthLayout>
</template>

<style scoped>
:deep(.content-body) {
    max-width: 800px; /* Legal pages need more space */
}

.legal-page {
    color: #475569;
    line-height: 1.8;
    padding-bottom: 60px;
}

.legal-intro {
    font-size: 16px;
    margin-bottom: 40px;
    color: #1e293b;
    font-weight: 500;
}

.legal-section {
    margin-bottom: 48px;
}

.legal-section h2 {
    font-size: 20px;
    color: #1e293b;
    margin-bottom: 24px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    border-left: 4px solid #0d9488;
    padding-left: 15px;
}

.legal-text p {
    font-size: 15px;
    margin-bottom: 16px;
}

.legal-list {
    padding-left: 25px;
}

.legal-list li {
    font-size: 15px;
    margin-bottom: 24px;
    padding-left: 10px;
}

.legal-list li strong {
    color: #0d9488;
    font-weight: 700;
}
</style>

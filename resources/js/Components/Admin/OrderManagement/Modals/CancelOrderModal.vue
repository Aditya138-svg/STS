<script setup>
import { ref } from 'vue'
import { router } from '@inertiajs/vue3'

const props = defineProps({
    show: Boolean,
    order: Object,
})

const emit = defineEmits(['close'])

const reason = ref('')
const processing = ref(false)

const submit = () => {
    if (!reason.value) return

    processing.value = true
    router.post(route('admin.order_management.orders.cancel'), {
        order_id: props.order.id,
        reason: reason.value,
    }, {
        onSuccess: () => {
            emit('close')
            reason.value = ''
        },
        onFinish: () => processing.value = false
    })
}
</script>

<template>
    <div v-if="show" class="modal-backdrop fade in"></div>
    <div v-if="show" class="modal fade in" style="display: block;" role="dialog" @click.self="$emit('close')">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" @click="$emit('close')">&times;</button>
                    <h4 class="modal-title">Cancel Order #{{ order?.order_number }}</h4>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Reason for Cancellation</label>
                        <textarea v-model="reason" class="form-control" rows="4" required placeholder="Enter reason..."></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" @click="$emit('close')">Close</button>
                    <button type="button" class="btn btn-danger" :disabled="!reason || processing" @click="submit">
                        {{ processing ? 'Processing...' : 'Cancel Order' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1040;
}
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1050;
    overflow-x: hidden;
    overflow-y: auto;
}
</style>

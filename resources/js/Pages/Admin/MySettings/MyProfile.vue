<script setup>
import { Head, useForm, usePage } from '@inertiajs/vue3';
import { ref, computed } from 'vue';
import { useAdminAssets } from '@/Composables/Admin';

const props = defineProps({
    user: Object,
    status: String,
});

const page = usePage();
const { route } = useAdminAssets();
const profilePicUrl = ref(props.user.profile_pic ? `/storage/${props.user.profile_pic}` : null);
const profilePicInput = ref(null);

const form = useForm({
    _method: 'POST', // For file uploads via POST
    company_name: props.user.company_name || 'Specialized Transport Services',
    name: props.user.name || '',
    email: props.user.email || '',
    phone1: props.user.phone1 || '',
    phone2: props.user.phone2 || '',
    profile_pic: null,
    password: '',
    password_confirmation: '',
    can_notify_new_order: props.user.can_notify_new_order == 1,
    cc_email: props.user.cc_email || '',
});

const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        form.profile_pic = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            profilePicUrl.value = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};

const submit = () => {
    form.post(route('admin.my_settings.my_profile.update'), {
        preserveScroll: true,
        onSuccess: () => {
            form.password = '';
            form.password_confirmation = '';
        },
    });
};

const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).replace(',', '');
};
</script>

<template>
    <Head title="My Profile" />

    <div class="content-wrapper">
        <section class="content-header">
            <h1 class="profile-title">My Profile</h1>
        </section>

        <section class="content">
            <div class="row">
                <div class="col-md-12">
                    <form @submit.prevent="submit" enctype="multipart/form-data">
                        <div class="box profile-box">
                            <div class="box-header with-border d-flex justify-content-between align-items-center">
                                <h3 class="box-title">Profile Details</h3>
                                <button type="button" class="btn btn-help">Help <i class="fa fa-question-circle"></i></button>
                            </div>
                            
                            <div class="box-body">
                                <!-- Flash Messages -->
                                <div v-if="page.props.flash?.success" class="alert alert-success alert-dismissible show">
                                    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                                    <i class="icon fa fa-check"></i> {{ page.props.flash.success }}
                                </div>
                                <div v-if="Object.keys(form.errors).length > 0" class="alert alert-danger alert-dismissible show">
                                    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                                    <i class="icon fa fa-ban"></i> Please fix the errors below.
                                </div>

                                <div class="row">
                                    <!-- Left Column -->
                                    <div class="col-md-6">
                                        <div class="form-group" :class="{'has-error': form.errors.company_name}">
                                            <label>Company Name</label>
                                            <input v-model="form.company_name" type="text" class="form-control" placeholder="Enter Company Name">
                                            <span class="help-block" v-if="form.errors.company_name">{{ form.errors.company_name }}</span>
                                        </div>

                                        <div class="form-group" :class="{'has-error': form.errors.email}">
                                            <label>Email address <span class="text-danger">*</span></label>
                                            <input v-model="form.email" type="email" class="form-control" placeholder="Enter Email address" required>
                                            <span class="help-block" v-if="form.errors.email">{{ form.errors.email }}</span>
                                        </div>

                                        <div class="form-group" :class="{'has-error': form.errors.profile_pic}">
                                            <label>Profile Pic</label>
                                            <div class="d-flex align-items-center">
                                                <input type="file" ref="profilePicInput" @change="handleProfilePicChange" class="d-none">
                                                <button type="button" @click="$refs.profilePicInput.click()" class="btn btn-default btn-sm">Choose File</button>
                                                <span class="ml-2 text-muted" v-if="!form.profile_pic">No file chosen</span>
                                                <span class="ml-2" v-else>{{ form.profile_pic.name }}</span>
                                                
                                                <div class="profile-pic-preview ml-auto">
                                                    <img :src="profilePicUrl || '/images/default-profile.png'" alt="profile pic" class="img-thumbnail" width="40">
                                                    <span class="small text-muted ml-1">profile pic</span>
                                                </div>
                                            </div>
                                            <p class="help-block small text-primary">Only jpeg, jpg, png, gif files are allowed. The maximum file size for uploads is 5 MB.</p>
                                            <span class="help-block" v-if="form.errors.profile_pic">{{ form.errors.profile_pic }}</span>
                                        </div>

                                        <div class="form-group" :class="{'has-error': form.errors.password}">
                                            <label>Password</label>
                                            <input v-model="form.password" type="password" class="form-control" placeholder="Password">
                                            <span class="help-block" v-if="form.errors.password">{{ form.errors.password }}</span>
                                        </div>

                                        <div class="form-group">
                                            <label>Created on</label>
                                            <input :value="formatDate(user.created_at)" type="text" class="form-control" readonly style="background-color: #eee;">
                                        </div>
                                    </div>

                                    <!-- Right Column -->
                                    <div class="col-md-6">
                                        <div class="form-group" :class="{'has-error': form.errors.name}">
                                            <label>Name <span class="text-danger">*</span></label>
                                            <input v-model="form.name" type="text" class="form-control" placeholder="Enter Name" required>
                                            <span class="help-block" v-if="form.errors.name">{{ form.errors.name }}</span>
                                        </div>

                                        <div class="form-group" :class="{'has-error': form.errors.phone1}">
                                            <label>Phone Number 1 <span class="text-danger">*</span></label>
                                            <input v-model="form.phone1" type="text" class="form-control" placeholder="Enter Phone Number 1" required>
                                            <span class="help-block" v-if="form.errors.phone1">{{ form.errors.phone1 }}</span>
                                        </div>

                                        <div class="form-group" :class="{'has-error': form.errors.phone2}">
                                            <label>Phone Number 2</label>
                                            <input v-model="form.phone2" type="text" class="form-control" placeholder="Enter Phone Number 2">
                                            <span class="help-block" v-if="form.errors.phone2">{{ form.errors.phone2 }}</span>
                                        </div>

                                        <div class="form-group">
                                            <label>Confirm Password</label>
                                            <input v-model="form.password_confirmation" type="password" class="form-control" placeholder="Confirm Password">
                                        </div>

                                        <div class="form-group">
                                            <label>Modified on</label>
                                            <input :value="formatDate(user.updated_at)" type="text" class="form-control" readonly style="background-color: #eee;">
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <div class="checkbox">
                                                <label>
                                                    <input type="checkbox" v-model="form.can_notify_new_order"> Include CC Emails
                                                </label>
                                            </div>
                                        </div>
                                        <div class="form-group" :class="{'has-error': form.errors.cc_email}">
                                            <textarea v-model="form.cc_email" class="form-control" rows="2" placeholder="Enter emails separated by commas"></textarea>
                                            <p class="help-block small text-info">
                                                Enter emails separated by commas, and only first 5 valid emails will be saved. Example: john@example.com, jane@example.com, boss@example.com.
                                            </p>
                                            <span class="help-block" v-if="form.errors.cc_email">{{ form.errors.cc_email }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="box-footer text-right">
                                <button type="submit" class="btn btn-submit" :disabled="form.processing">Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
.content-wrapper {
    background: #f4f7f6;
    min-height: 100vh;
    padding: 20px;
}

.profile-title {
    font-size: 24px;
    font-weight: 600;
    color: #333;
    margin-bottom: 20px;
    margin-left: 15px;
}

.profile-box {
    border-top: 3px solid #1a5a5a;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    border-radius: 4px;
    background: #fff;
}

.box-header {
    padding: 15px;
    border-bottom: 1px solid #f4f4f4;
}

.box-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    color: #1a5a5a;
}

.btn-help {
    background: #1a5a5a;
    color: #fff;
    border-radius: 4px;
    font-size: 13px;
}

.box-body {
    padding: 20px;
}

.form-group label {
    font-weight: 600;
    color: #444;
    margin-bottom: 5px;
}

.form-control {
    border-radius: 4px;
    border: 1px solid #ddd;
    box-shadow: none;
    height: 38px;
}

.form-control:focus {
    border-color: #1a5a5a;
    box-shadow: none;
}

textarea.form-control {
    height: auto;
    background-color: #f9f9f9;
}

.help-block {
    margin-top: 5px;
    margin-bottom: 10px;
    color: #737373;
}

.profile-pic-preview {
    display: flex;
    align-items: center;
}

.img-thumbnail {
    border-radius: 4px;
    padding: 2px;
}

.checkbox label {
    font-weight: 600;
}

.box-footer {
    padding: 15px;
    background-color: #fff;
    border-top: 1px solid #f4f4f4;
}

.btn-submit {
    background: #1a5a5a;
    color: #fff;
    padding: 8px 30px;
    font-weight: 600;
    border-radius: 4px;
}

.btn-submit:hover {
    background: #144646;
    color: #fff;
}

.text-danger {
    color: #dd4b39 !important;
}

.has-error .form-control {
    border-color: #dd4b39;
}

.has-error .help-block {
    color: #dd4b39;
}

.ml-auto {
    margin-left: auto;
}

.ml-1 { margin-left: 5px; }
.ml-2 { margin-left: 10px; }

.d-flex { display: flex; }
.align-items-center { align-items: center; }
.justify-content-between { justify-content: space-between; }
</style>

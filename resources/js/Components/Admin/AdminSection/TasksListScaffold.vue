<script setup>
import { computed } from 'vue'
import { Head, usePage } from '@inertiajs/vue3'

const page = usePage()
const tasksPage = computed(() => page.props.tasksPage ?? {})
</script>

<template>
    <Head :title="tasksPage.title ?? 'Tasks'" />

    <div class="row">
        <div class="col-xs-12">
            <div class="box">
                <div class="box-header with-border">
                    <h3 class="box-title">{{ tasksPage.title ?? 'Tasks' }}</h3>
                </div>
                <div class="box-body">
                    <table class="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="row in (tasksPage.rows ?? [])" :key="row.id">
                                <td>{{ row.id }}</td>
                                <td>{{ row.title }}</td>
                                <td>{{ row.description || '-' }}</td>
                            </tr>
                            <tr v-if="!(tasksPage.rows ?? []).length">
                                <td colspan="3" class="text-center text-muted">No records found.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

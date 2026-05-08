<?php

namespace App\Http\Controllers\Admin\AdminSection;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;

class UserGroupsController extends Controller
{
    public function index(Request $request): Response
    {
        $groups = $this->getGroups();

        return Inertia::render('Admin/AdminSection/Users/Group', [
            'groups' => $groups,
            'filters' => [
                'status' => $request->get('status', ''),
            ]
        ]);
    }

    public function getGroupUsers(Request $request): JsonResponse
    {
        $groupId = $request->get('id');
        if (!$groupId) {
            return response()->json(['status' => false, 'message' => 'Group ID is required.']);
        }

        // The mapping table is user_groups (groups_id, users_id)
        $users = DB::table('users')
            ->join('user_groups', 'users.id', '=', 'user_groups.users_id')
            ->where('user_groups.groups_id', $groupId)
            ->select('users.id', 'users.name as full_name')
            ->get();

        $groupName = DB::table('groups')->where('id', $groupId)->value('group_name');

        return response()->json([
            'status' => true,
            'group_name' => $groupName,
            'data' => $users
        ]);
    }

    public function bulkDelete(Request $request): RedirectResponse
    {
        $ids = $request->input('ids', []);
        if (empty($ids)) {
            return back()->with('error', 'No groups selected.');
        }

        DB::table('groups')->whereIn('id', $ids)->delete();

        return back()->with('success', 'Selected groups deleted successfully.');
    }

    private function getGroups()
    {
        if (!Schema::hasTable('groups')) {
            return [];
        }

        return DB::table('groups')
            ->select('id', 'group_name', 'active', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($group) {
                return [
                    'id' => $group->id,
                    'group_name' => $group->group_name,
                    'active' => $group->active,
                    'created_at' => $group->created_at,
                    'created_at_formatted' => date('m/d/Y h:i A', strtotime($group->created_at)),
                ];
            });
    }
}

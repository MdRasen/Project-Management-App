<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\TaskResource;
use App\Http\Resources\UserResource;
use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Task::query();

        $sortField = request('sort_field', 'created_at');
        $sortDirection = request('sort_direction', 'desc');

        // Check if name exist
        if (request('name')) {
            $query->where('name', 'like', '%' . request('name') . '%');
        }
        // Check if status exist
        if (request('status')) {
            $query->where('status', request('status'));
        }

        $tasks = $query->orderBy($sortField, $sortDirection)->paginate(10);

        return inertia("Task/Index", [
            "tasks" => TaskResource::collection($tasks),
            'queryParams' => request()->query() ?: null, //If empty array, then set null
            'success' => session('success')
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $projects = Project::query()->orderBy('name', 'asc')->get();
        $users = User::query()->orderBy('name', 'asc')->get();

        return inertia("Task/Create", [
            'projects' => ProjectResource::collection($projects),
            'users' => UserResource::collection($users)
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        $data = $request->validated();
        // @var $image \Illuminate\Http\UploadedFile
        $image = $data['image'] ?? null;
        $data['created_by'] = Auth::id();
        $data['updated_by'] = Auth::id();
        if ($image) {
            $data['image_path'] = $image->store('task/' . Str::random(), 'public');
        }

        Task::create($data);

        return to_route("task.index")->with('success', 'Task has been created.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        return inertia("Task/Show", [
            'task' => new TaskResource($task),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        $projects = Project::query()->orderBy('name', 'asc')->get();
        $users = User::query()->orderBy('name', 'asc')->get();

        return inertia('Task/Edit', [
            'task' => new TaskResource($task),
            'projects' => ProjectResource::collection($projects),
            'users' => UserResource::collection($users)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        $data = $request->validated();
        // @var $image \Illuminate\Http\UploadedFile
        $image = $data['image'] ?? null;
        $data['created_by'] = Auth::id();
        $data['updated_by'] = Auth::id();
        if ($image) {
            if ($task->image_path) {
                Storage::disk('public')->deleteDirectory(dirname($task->image_path));
            }
            $data['image_path'] = $image->store('task/' . Str::random(), 'public');
        }

        $task->update($data);
        return to_route("task.index")->with('success', "Task \"$task->name\" has been updated.");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $name = $task->name;
        if ($task->image_path) {
            Storage::disk('public')->deleteDirectory(dirname($task->image_path));
        }
        $task->delete();
        return to_route("task.index")->with('success', "Task \"$name\" has been deleted.");
    }
}

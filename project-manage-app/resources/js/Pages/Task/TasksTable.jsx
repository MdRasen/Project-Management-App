import Pagination from "@/Components/Pagination";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import { TASK_STATUS_CLASS_MAP, TASK_STATUS_TEXT_MAP } from "@/constants";
import TableHeading from "@/Components/TableHeading";
import { Link, router } from "@inertiajs/react";

export default function TasksTable({
    tasks,
    queryParams = null,
    pageName,
    user,
    hideProjectName = false,
}) {
    queryParams = queryParams || {}; // If null, then it's null else assigned an empty object
    pageName = pageName || ""; // If null, then it's null else assigned an empty
    const searchFieldChanged = (paraName, value) => {
        if (value) {
            queryParams[paraName] = value;
        } else {
            delete queryParams[paraName];
        }
        // Redirect with param values
        if (pageName === "ProjectShow") {
            router.get(route("project.index", queryParams));
        } else if (pageName === "UserShow") {
            router.get(route("user.show", [user, queryParams]));
        } else if (pageName === "MyTasksShow") {
            router.get(route("task.myTasks", queryParams));
        } else {
            router.get(route("task.index", queryParams));
        }
    };

    const onKeyPress = (name, e) => {
        if (e.key !== "Enter") return;
        searchFieldChanged(name, e.target.value);
    };

    const sortChanged = (name) => {
        if (name === queryParams.sort_field) {
            if (queryParams.sort_direction === "asc") {
                queryParams.sort_direction = "desc";
            } else {
                queryParams.sort_direction = "asc";
            }
        } else {
            queryParams.sort_field = name;
            queryParams.sort_direction = "asc";
        }
        // Redirect with param values
        if (pageName === "ProjectShow") {
            router.get(route("project.index", queryParams));
        } else if (pageName === "UserShow") {
            router.get(route("user.show", [user, queryParams]));
        } else if (pageName === "MyTasksShow") {
            router.get(route("task.myTasks", queryParams));
        } else {
            router.get(route("task.index", queryParams));
        }
    };

    const deleteTask = (task) => {
        if (!window.confirm("Are you sure you want to delete the task?")) {
            return;
        }
        router.delete(route("task.destroy", task.id));
    };

    return (
        <>
            <div className="overflow-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                        <tr className="text-nowrap">
                            <TableHeading
                                name="id"
                                sort_field={queryParams.sort_field}
                                sort_direction={queryParams.sort_direction}
                                sortChanged={sortChanged}
                            >
                                ID
                            </TableHeading>
                            <th className="px-3 py-3">Image</th>
                            <TableHeading
                                name="name"
                                sort_field={queryParams.sort_field}
                                sort_direction={queryParams.sort_direction}
                                sortChanged={sortChanged}
                            >
                                Name
                            </TableHeading>
                            <TableHeading
                                name="status"
                                sort_field={queryParams.sort_field}
                                sort_direction={queryParams.sort_direction}
                                sortChanged={sortChanged}
                            >
                                Status
                            </TableHeading>
                            <TableHeading
                                name="created_at"
                                sort_field={queryParams.sort_field}
                                sort_direction={queryParams.sort_direction}
                                sortChanged={sortChanged}
                            >
                                Create Date
                            </TableHeading>
                            <TableHeading
                                name="due_date"
                                sort_field={queryParams.sort_field}
                                sort_direction={queryParams.sort_direction}
                                sortChanged={sortChanged}
                            >
                                Due Date
                            </TableHeading>
                            <th className="px-3 py-3">Created By</th>
                            <th className="px-3 py-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                        {tasks.data.length != 0 && (
                            <tr className="text-nowrap">
                                <th className="px-3 py-3" colSpan={2}></th>
                                <th className="px-3 py-3">
                                    <TextInput
                                        className="w-full"
                                        defaultValue={queryParams.name}
                                        placeholder="Task Name"
                                        onBlur={(e) =>
                                            searchFieldChanged(
                                                "name",
                                                e.target.value
                                            )
                                        }
                                        onKeyPress={(e) =>
                                            onKeyPress("name", e)
                                        }
                                    />
                                </th>
                                <th className="px-3 py-3">
                                    <SelectInput
                                        className="w-full"
                                        defaultValue={queryParams.status}
                                        onChange={(e) =>
                                            searchFieldChanged(
                                                "status",
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="">Select Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="in_progress">
                                            In Progress
                                        </option>
                                        <option value="completed">
                                            Completed
                                        </option>
                                    </SelectInput>
                                </th>
                                <th className="px-3 py-3" colSpan={4}></th>
                            </tr>
                        )}
                    </thead>
                    <tbody>
                        {/* {JSON.stringify(tasks, undefined, 2)} */}
                        {tasks.data.map((task) => (
                            <tr
                                key={task.id}
                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                            >
                                <td className="px-3 py-2">{task.id}</td>
                                <td className="px-3 py-2">
                                    <img
                                        src={task.image_path}
                                        alt="task img"
                                        style={{ width: 60 }}
                                    />
                                </td>
                                <th className="px-3 py-2">
                                    <div className="text-gray-100 text-wrap hover:underline">
                                        <Link
                                            href={route("task.show", task.id)}
                                        >
                                            {task.name}
                                        </Link>
                                    </div>
                                    {!hideProjectName && (
                                        <p className="text-gray-400 text-sm hover:underline">
                                            <Link
                                                href={route(
                                                    "project.show",
                                                    task.project.id
                                                )}
                                            >
                                                {task.project.name}
                                            </Link>
                                        </p>
                                    )}
                                </th>
                                <td className="px-3 py-2">
                                    <span
                                        className={
                                            "px-2 py-1 rounded text-white " +
                                            TASK_STATUS_CLASS_MAP[task.status]
                                        }
                                    >
                                        {TASK_STATUS_TEXT_MAP[task.status]}
                                    </span>
                                </td>
                                <td className="px-3 py-2 text-nowrap">
                                    {task.created_at}
                                </td>
                                <td className="px-3 py-2 text-nowrap">
                                    {task.due_date}
                                </td>
                                <td className="px-3 py-2">
                                    {task.createdBy.name}
                                </td>
                                <td className="px-3 py-2">
                                    <Link
                                        href={route("task.edit", task.id)}
                                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={(e) => deleteTask(task)}
                                        className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {tasks.data.length === 0 && (
                            <tr className="text-nowrap text-center">
                                <th className="px-3 py-3" colSpan={8}>
                                    No task available!
                                </th>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <Pagination links={tasks.meta.links} />
        </>
    );
}

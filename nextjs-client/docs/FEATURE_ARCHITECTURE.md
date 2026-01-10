# Feature Architecture & File Relationships

This project follows a **Feature-based Architecture**, where all logic related to a specific feature (UI, Hooks, API) is co-located within the feature's directory (`app/(admin)/...`).

## Architecture Pattern

Each feature strictly follows this data flow pattern. This separation of concerns ensures that the UI remains declarative while business logic is encapsulated in hooks.

```mermaid
graph TD
    Page[Page Component<br/>(page.tsx)]:::ui --> ManagementHook[Management Hook<br/>(hooks/use-*-management.ts)]:::logic
    ManagementHook --> QueryHook[Query Hook<br/>(hooks/use-*-query.ts)]:::data
    QueryHook --> API[API Client<br/>(lib/api-client)]:::core
    Page --> Components[UI Components<br/>(Dialogs, Tables)]:::ui

    classDef ui fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef logic fill:#fff9c4,stroke:#fbc02d,stroke-width:2px;
    classDef data fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px;
    classDef core fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px;
```

### Component Roles

1.  **Page (`page.tsx`)**
    *   **Role**: View & Composition.
    *   **Responsibility**: Renders the layout (Header, Toolbar, Table, Dialog). It calls the Management Hook to obtain formatted data and event handlers.
    *   **Rule**: Minimal logic. No `useEffect` for data fetching or complex state allowed directly here.

2.  **Management Hook (`hooks/use-*-management.ts`)**
    *   **Role**: Presenter / Controller.
    *   **Responsibility**:
        *   Manages Client-side State (Search params, Pagination, Dialog visibility).
        *   Orchestrates CRUD operations (calls Query Hooks).
        *   Handles Success/Error Toasts.
        *   Transforms data for the view if necessary.

3.  **Query Hook (`hooks/use-*-query.ts`)**
    *   **Role**: Data Access Layer.
    *   **Responsibility**:
        *   Defines API Interfaces (Types).
        *   Encapsulates `react-query` logic (`createPaginatedQuery`, `createMutation`).
        *   Directly calls `apiClient`.

---

## Screen-by-Screen File Linkages

### 1. Users Screen (`/users`)
*   **Directory**: `app/(admin)/(with-header)/users`
*   **Core Files**:
    *   📄 `page.tsx`: Main user list view.
    *   🔗 `hooks/use-user-management.ts`: Logic for user search, creation, editing, and deletion.
    *   🔌 `hooks/use-user-query.ts`: API definitions for `UserDetail` and React Query hooks (`useUsers`, `useUserRoles`).
    *   🖼️ `user-dialog.tsx`: User creation/edit form modal.
    *   📊 `columns.tsx`: Data table column definitions.

### 2. Roles Screen (`/roles`)
*   **Directory**: `app/(admin)/(with-header)/roles`
*   **Core Files**:
    *   📄 `page.tsx`: Role list view.
    *   🔗 `hooks/use-role-management.ts`: Logic for role management.
    *   🔌 `hooks/use-role-query.ts`: API definitions for `RoleInfo` and menu assignment logic.
    *   🖼️ `role-dialog.tsx`: Role form including the **Menu Permission Tree**.

### 3. Menus Screen (`/menus`)
*   **Directory**: `app/(admin)/(with-header)/menus`
*   **Core Files**:
    *   📄 `page.tsx`: Split-view layout (Tree on left, Form on right).
    *   🔗 `hooks/use-menu-management.ts`: Logic for tree selection, adding child menus, and updates.
    *   🔌 `hooks/use-menu-query.ts`: API definitions for `MenuInfo` (recursive structure).
    *   🖼️ `menu-tree.tsx`: Recursive tree component.
    *   🖼️ `menu-form.tsx`: Detail edit form for the selected menu.

### 4. Board Master Screen (`/boards/master`)
*   **Directory**: `app/(admin)/(with-header)/boards/master`
*   **Core Files**:
    *   📄 `page.tsx`: Board configuration list.
    *   🔗 `hooks/use-board-master-management.ts`: Logic for managing board types (NOTICE, FREE, etc.).
    *   🔌 `hooks/use-board-master-query.ts`: API definitions for `BoardsMaster`.
    *   🔌 `hooks/use-board-master-form.ts`: Form schema and state management.
    *   🖼️ `board-dialog.tsx`: Wrapper dialog component.
    *   🖼️ `board-form.tsx`: Pure form component.

### 5. Board Post Screen (`/boards/board`)
*   **Directory**: `app/(admin)/(with-header)/boards/board`
*   **Core Files**:
    *   📄 `page.tsx`: List of posts for a specific board.
    *   🔗 `hooks/use-board-management.ts`: Logic for post CRUD and search.
    *   🔌 `hooks/use-board-query.ts`: API definitions for `BoardsBoard` and **File Attachment logic**.
    *   🖼️ `board-dialog.tsx`: Wrapper dialog component.
    *   🖼️ `board-form.tsx`: Pure form component with UI and validation logic.
    *   🖼️ `columns.tsx`: Table columns (includes file attachment icons).

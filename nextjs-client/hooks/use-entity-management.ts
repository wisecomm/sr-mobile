/**
 * useEntityManagement Hook
 * 
 * CRUD 작업을 위한 재사용 가능한 제네릭 훅
 */

import { useState, useCallback } from 'react';
import { PaginationState } from '@tanstack/react-table';
import { useToast } from '@/hooks/use-toast';

/**
 * Entity 관리 설정
 */
export interface EntityManagementConfig<TEntity, TSearchParams> {
    // 엔티티 이름 (메시지용)
    entityName: string;
    entityNamePlural?: string;
    
    // 초기 검색 파라미터
    initialSearchParams: TSearchParams;
    
    // 초기 페이지네이션
    initialPageSize?: number;
    
    // API 훅
    useQuery: (params: { page: number; size: number } & TSearchParams) => {
        data: { list: TEntity[]; pages: number } | undefined;
        isLoading: boolean;
    };
    useCreate: () => {
        mutateAsync: (data: Partial<TEntity>) => Promise<unknown>;
    };
    useUpdate: () => {
        mutateAsync: (params: { id: string; data: Partial<TEntity> }) => Promise<unknown>;
    };
    useDelete: () => {
        mutateAsync: (id: string) => Promise<unknown>;
    };
    
    // ID 추출 함수
    getId: (entity: TEntity) => string;
}

/**
 * Entity 관리 훅 리턴 타입
 */
export interface UseEntityManagementReturn<TEntity, TSearchParams> {
    // 데이터
    entities: TEntity[];
    totalPages: number;
    isLoading: boolean;
    
    // 페이지네이션
    pagination: PaginationState;
    onPaginationChange: (updater: PaginationState | ((old: PaginationState) => PaginationState)) => void;
    
    // 검색
    searchParams: TSearchParams;
    onSearch: (params: TSearchParams) => void;
    
    // 다이얼로그
    dialogOpen: boolean;
    selectedEntity: TEntity | null;
    isEditMode: boolean;
    openDialog: (entity?: TEntity) => void;
    closeDialog: () => void;
    
    // CRUD 작업
    handleCreate: (data: Partial<TEntity>) => Promise<void>;
    handleUpdate: (data: Partial<TEntity>) => Promise<void>;
    handleDelete: (ids: string[]) => Promise<void>;
    handleSubmit: (data: Partial<TEntity>) => Promise<void>;
}

/**
 * Entity 관리 제네릭 훅
 */
export function useEntityManagement<TEntity, TSearchParams>(
    config: EntityManagementConfig<TEntity, TSearchParams>
): UseEntityManagementReturn<TEntity, TSearchParams> {
    const { toast } = useToast();
    
    const {
        entityName,
        entityNamePlural = entityName,
        initialSearchParams,
        initialPageSize = 10,
        useQuery,
        useCreate,
        useUpdate,
        useDelete,
        getId,
    } = config;
    
    // 상태 관리
    const [searchParams, setSearchParams] = useState<TSearchParams>(initialSearchParams);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: initialPageSize,
    });
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedEntity, setSelectedEntity] = useState<TEntity | null>(null);
    
    // API 훅
    const { data, isLoading } = useQuery({
        page: pagination.pageIndex,
        size: pagination.pageSize,
        ...searchParams,
    });
    
    const createMutation = useCreate();
    const updateMutation = useUpdate();
    const deleteMutation = useDelete();
    
    /**
     * 검색
     */
    const handleSearch = useCallback((params: TSearchParams) => {
        setSearchParams(params);
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
    }, []);
    
    /**
     * 다이얼로그 열기
     */
    const openDialog = useCallback((entity?: TEntity) => {
        setSelectedEntity(entity || null);
        setDialogOpen(true);
    }, []);
    
    /**
     * 다이얼로그 닫기
     */
    const closeDialog = useCallback(() => {
        setDialogOpen(false);
        setSelectedEntity(null);
    }, []);
    
    /**
     * 생성
     */
    const handleCreate = useCallback(async (entityData: Partial<TEntity>) => {
        try {
            await createMutation.mutateAsync(entityData);
            
            toast({
                title: '등록 완료',
                description: `${entityName}이(가) 등록되었습니다.`,
                variant: 'success',
            });
            
            closeDialog();
        } catch (error) {
            const message = error instanceof Error ? error.message : `${entityName} 등록에 실패했습니다.`;
            toast({
                title: '등록 실패',
                description: message,
                variant: 'destructive',
            });
            throw error;
        }
    }, [createMutation, toast, closeDialog, entityName]);
    
    /**
     * 수정
     */
    const handleUpdate = useCallback(async (entityData: Partial<TEntity>) => {
        if (!selectedEntity) {
            throw new Error(`선택된 ${entityName}이(가) 없습니다.`);
        }
        
        try {
            const id = getId(selectedEntity);
            
            await updateMutation.mutateAsync({
                id,
                data: entityData,
            });
            
            toast({
                title: '수정 완료',
                description: `${entityName} 정보가 수정되었습니다.`,
                variant: 'success',
            });
            
            closeDialog();
        } catch (error) {
            const message = error instanceof Error ? error.message : `${entityName} 수정에 실패했습니다.`;
            toast({
                title: '수정 실패',
                description: message,
                variant: 'destructive',
            });
            throw error;
        }
    }, [selectedEntity, updateMutation, toast, closeDialog, entityName, getId]);
    
    /**
     * 삭제
     */
    const handleDelete = useCallback(async (ids: string[]) => {
        if (ids.length === 0) {
            toast({
                title: '알림',
                description: `삭제할 ${entityName}을(를) 선택해주세요.`,
                variant: 'default',
            });
            return;
        }
        
        const confirmed = window.confirm(
            `선택한 ${ids.length}개의 ${ids.length > 1 ? entityNamePlural : entityName}을(를) 삭제하시겠습니까?`
        );
        
        if (!confirmed) return;
        
        try {
            await Promise.all(ids.map(id => deleteMutation.mutateAsync(id)));
            
            toast({
                title: '삭제 완료',
                description: `${entityName}이(가) 삭제되었습니다.`,
                variant: 'success',
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : `${entityName} 삭제에 실패했습니다.`;
            toast({
                title: '삭제 실패',
                description: message,
                variant: 'destructive',
            });
            throw error;
        }
    }, [deleteMutation, toast, entityName, entityNamePlural]);
    
    /**
     * 제출 (생성 또는 수정)
     */
    const handleSubmit = useCallback(async (entityData: Partial<TEntity>) => {
        if (selectedEntity) {
            await handleUpdate(entityData);
        } else {
            await handleCreate(entityData);
        }
    }, [selectedEntity, handleCreate, handleUpdate]);
    
    return {
        // 데이터
        entities: data?.list || [],
        totalPages: data?.pages || 0,
        isLoading,
        
        // 페이지네이션
        pagination,
        onPaginationChange: setPagination,
        
        // 검색
        searchParams,
        onSearch: handleSearch,
        
        // 다이얼로그
        dialogOpen,
        selectedEntity,
        isEditMode: !!selectedEntity,
        openDialog,
        closeDialog,
        
        // CRUD
        handleCreate,
        handleUpdate,
        handleDelete,
        handleSubmit,
    };
}

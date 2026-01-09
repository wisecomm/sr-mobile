/**
 * API Clients Export
 * 
 * @deprecated API 클라이언트가 각 페이지 디렉토리로 이동되었습니다.
 * 
 * 새로운 위치:
 * - userApi: @/app/(admin)/(with-header)/users/api
 * - roleApi: @/app/(admin)/(with-header)/roles/api
 * - menuApi: @/app/(admin)/(with-header)/menus/api
 * - boardMasterApi: @/app/(admin)/(with-header)/boards/master/api
 * - boardPostApi: @/app/(admin)/(with-header)/boards/board/api
 * 
 * 이 파일은 향후 버전에서 삭제될 예정입니다.
 */

// 하위 호환성을 위한 re-export
export { userApi } from '@/app/(admin)/(with-header)/users/api';
export { roleApi } from '@/app/(admin)/(with-header)/roles/api';
export { menuApi } from '@/app/(admin)/(with-header)/menus/api';
export { boardMasterApi } from '@/app/(admin)/(with-header)/boards/master/api';
export { boardPostApi } from '@/app/(admin)/(with-header)/boards/board/api';

export type { UserSearchParams } from '@/app/(admin)/(with-header)/users/api';
export type { RoleSearchParams } from '@/app/(admin)/(with-header)/roles/api';
export type { BoardMaster, BoardMasterSearchParams } from '@/app/(admin)/(with-header)/boards/master/api';
export type { Board, BoardPostSearchParams, BoardFile } from '@/app/(admin)/(with-header)/boards/board/api';

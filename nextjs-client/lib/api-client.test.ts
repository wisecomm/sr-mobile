/**
 * API Client Test Examples
 * 
 * 새로운 API 클라이언트를 테스트하는 예제 코드입니다.
 * 실제 프로젝트에서 사용 전에 이 파일로 테스트해보세요.
 */

import { userApi, roleApi, menuApi } from '@/lib/api';
import { isSuccessResponse, unwrapResponse } from '@/types/api-utils';

/**
 * User API 테스트
 */
export async function testUserApi() {
    console.group('🧪 User API Test');

    try {
        // 1. 사용자 목록 조회
        console.log('1️⃣ 사용자 목록 조회...');
        const usersResponse = await userApi.search({
            page: 0,
            size: 10,
            userName: '',
        });

        if (isSuccessResponse(usersResponse)) {
            console.log('✅ 성공:', usersResponse.data.list.length, '명의 사용자');
        } else {
            console.error('❌ 실패:', usersResponse.message);
        }

        // 2. 특정 사용자 조회 (있는 경우)
        if (isSuccessResponse(usersResponse) && usersResponse.data.list.length > 0) {
            const firstUser = usersResponse.data.list[0];
            console.log('2️⃣ 사용자 상세 조회...', firstUser.userId);

            const userRoles = await userApi.getRoles(firstUser.userId);
            if (isSuccessResponse(userRoles)) {
                console.log('✅ 역할 조회 성공:', userRoles.data);
            }
        }

        // 3. 사용자 생성 테스트 (실제로는 실행하지 않음)
        console.log('3️⃣ 사용자 생성 (스킵)');
        // const createResponse = await userApi.create({
        //     userId: 'testuser',
        //     userName: 'Test User',
        //     userEmail: 'test@example.com',
        //     useYn: 'Y',
        // });

    } catch (error) {
        console.error('테스트 중 에러:', error);
    }

    console.groupEnd();
}

/**
 * Role API 테스트
 */
export async function testRoleApi() {
    console.group('🧪 Role API Test');

    try {
        // 1. 역할 목록 조회
        console.log('1️⃣ 역할 목록 조회...');
        const rolesResponse = await roleApi.search({
            page: 0,
            size: 10,
        });

        if (isSuccessResponse(rolesResponse)) {
            console.log('✅ 성공:', rolesResponse.data.list.length, '개의 역할');
            
            // 2. 첫 번째 역할의 메뉴 조회
            if (rolesResponse.data.list.length > 0) {
                const firstRole = rolesResponse.data.list[0];
                console.log('2️⃣ 역할 메뉴 조회...', firstRole.roleId);

                const menusResponse = await roleApi.getMenus(firstRole.roleId);
                if (isSuccessResponse(menusResponse)) {
                    console.log('✅ 메뉴 조회 성공:', menusResponse.data.length, '개');
                }
            }
        } else {
            console.error('❌ 실패:', rolesResponse.message);
        }

    } catch (error) {
        console.error('테스트 중 에러:', error);
    }

    console.groupEnd();
}

/**
 * Menu API 테스트
 */
export async function testMenuApi() {
    console.group('🧪 Menu API Test');

    try {
        // 1. 전체 메뉴 조회
        console.log('1️⃣ 전체 메뉴 조회...');
        const menusResponse = await menuApi.getList();

        if (isSuccessResponse(menusResponse)) {
            console.log('✅ 성공:', menusResponse.data.length, '개의 메뉴');
        } else {
            console.error('❌ 실패:', menusResponse.message);
        }

        // 2. 내 메뉴 조회
        console.log('2️⃣ 내 메뉴 조회...');
        const myMenusResponse = await menuApi.getMyMenus();

        if (isSuccessResponse(myMenusResponse)) {
            console.log('✅ 내 메뉴 성공:', myMenusResponse.data.length, '개');
        } else {
            console.error('❌ 실패:', myMenusResponse.message);
        }

    } catch (error) {
        console.error('테스트 중 에러:', error);
    }

    console.groupEnd();
}

/**
 * 모든 테스트 실행
 */
export async function runAllTests() {
    console.log('🚀 API Client Tests 시작\n');

    await testUserApi();
    console.log('');

    await testRoleApi();
    console.log('');

    await testMenuApi();
    console.log('');

    console.log('✅ 모든 테스트 완료!');
}

/**
 * 에러 처리 테스트
 */
export async function testErrorHandling() {
    console.group('🧪 Error Handling Test');

    try {
        // 존재하지 않는 사용자 조회
        console.log('1️⃣ 존재하지 않는 사용자 조회...');
        const response = await userApi.getById('nonexistent-user-id');

        if (isSuccessResponse(response)) {
            console.log('✅ 사용자 찾음:', response.data);
        } else {
            console.log('ℹ️ 예상된 에러:', response.message);
        }

        // unwrapResponse를 사용한 에러 처리
        console.log('2️⃣ unwrapResponse 테스트...');
        try {
            const user = unwrapResponse(response);
            console.log('사용자:', user);
        } catch (error) {
            console.log('ℹ️ 예외 발생 (예상됨):', error instanceof Error ? error.message : error);
        }

    } catch (error) {
        console.error('테스트 중 에러:', error);
    }

    console.groupEnd();
}

/**
 * 성능 비교 테스트
 */
export async function testPerformance() {
    console.group('🧪 Performance Test');

    const iterations = 10;

    // 새로운 API 클라이언트
    console.log('새로운 API 클라이언트 성능 테스트...');
    const start1 = performance.now();
    for (let i = 0; i < iterations; i++) {
        await userApi.search({ page: 0, size: 10 });
    }
    const end1 = performance.now();
    const newApiTime = end1 - start1;

    console.log(`✅ ${iterations}회 호출 평균: ${(newApiTime / iterations).toFixed(2)}ms`);
    console.log(`   총 소요 시간: ${newApiTime.toFixed(2)}ms`);

    console.groupEnd();
}

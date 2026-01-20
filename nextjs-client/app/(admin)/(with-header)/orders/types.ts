/**
 * 주문 타입 정의
 */
export interface Order {
    orderId: string;
    custNm: string;
    orderNm: string;
    orderStatus: string;
    orderAmt: number;
    orderDate: string; // ISO 8601 string
    useYn: string;

    sysInsertDtm?: string;
    sysInsertUserId?: string;
    sysUpdateDtm?: string;
    sysUpdateUserId?: string;
}

export type OrderDetail = Order;

/**
 * 주문 검색 파라미터
 */
export interface OrderSearchParams {
    page: number;
    size: number;
    custNm?: string;
    startDate?: string;
    endDate?: string;
    sort?: string[];
    [key: string]: unknown;
}

/**
 * 게시판 마스터 타입
 */
export interface BoardsMaster {
    brdId: string;
    brdNm: string;
    brdDesc?: string;
    replyUseYn: string;
    fileUseYn: string;
    fileMaxCnt: number;
    useYn: string;
    sysInsertDtm?: string;
    sysInsertUserId?: string;
    sysUpdateDtm?: string;
    sysUpdateUserId?: string;
}

/**
 * 게시판 마스터 검색 파라미터
 */
export interface BoardsMasterSearchParams {
    page: number;
    size: number;
    brdNm?: string;
    startDate?: string;
    endDate?: string;
}

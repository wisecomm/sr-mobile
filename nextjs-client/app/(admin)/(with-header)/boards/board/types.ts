/**
 * 게시물 첨부파일 타입
 */
export interface BoardsBoardFile {
    fileId: number;
    boardId: number;
    filePath: string;
    orgFileNm: string;
    fileSize: number;
    fileExt: string;
}

/**
 * 게시물 타입
 */
export interface BoardsBoard {
    boardId: number;
    brdId: string;
    userId: string;
    title: string;
    contents?: string;
    hitCnt: number;
    secretYn: string;
    useYn: string;
    sysInsertDtm?: string;
    sysInsertUserId?: string;
    sysUpdateDtm?: string;
    sysUpdateUserId?: string;
    fileList?: BoardsBoardFile[];
}

/**
 * 게시물 검색 파라미터
 */
export interface BoardsBoardSearchParams {
    page: number;
    size: number;
    brdId: string;
    searchType?: string;
    keyword?: string;
    startDate?: string;
    endDate?: string;
    [key: string]: unknown;
}

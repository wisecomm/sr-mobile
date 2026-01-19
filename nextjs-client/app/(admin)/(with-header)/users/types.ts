export interface User {
    userId: string;
    userEmail: string;
    userMobile: string;
    userName: string;
    userNick: string;
    userMsg?: string;
    userDesc?: string;
    userStatCd: string;
    userSnsid?: string;
    useYn: string;
    roleIds?: string[];
    sysInsertDtm?: string;
    sysUpdateDtm?: string;
}

export type UserDetail = User;

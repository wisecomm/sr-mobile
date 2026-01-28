package com.example.springrest.domain.boards.master.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 게시판 마스터 응답 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoardMasterResponse {
    private String brdId;
    private String brdNm;
    private String brdDesc;
    private String replyUseYn;
    private String fileUseYn;
    private Integer fileMaxCnt;
    private String useYn;
    private LocalDateTime sysInsertDtm;
    private String sysInsertUserId;
    private LocalDateTime sysUpdateDtm;
    private String sysUpdateUserId;
}

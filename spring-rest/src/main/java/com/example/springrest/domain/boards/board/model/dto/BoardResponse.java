package com.example.springrest.domain.boards.board.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

import com.example.springrest.domain.boards.board.model.entity.BoardFile;

/**
 * 게시물 응답 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoardResponse {
    private Integer boardId;
    private String brdId;
    private String userId;
    private String title;
    private String contents;
    private Integer hitCnt;
    private String secretYn;
    private String useYn;
    private LocalDateTime sysInsertDtm;
    private String sysInsertUserId;
    private LocalDateTime sysUpdateDtm;
    private String sysUpdateUserId;
    private List<BoardFile> fileList;
}

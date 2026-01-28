package com.example.springrest.domain.boards.master.service;

import com.example.springrest.domain.boards.master.model.dto.BoardMasterRequest;
import com.example.springrest.domain.boards.master.model.entity.BoardMaster;
import com.example.springrest.domain.boards.master.repository.BoardMasterMapper;
import com.example.springrest.global.model.dto.PageResponse;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import com.example.springrest.global.common.service.BaseService;

/**
 * 게시판 마스터 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BoardMasterService extends BaseService<BoardMaster, String, BoardMasterMapper> {

    private final BoardMasterMapper boardMasterMapper;
    private final com.example.springrest.domain.boards.master.model.mapper.BoardMasterDtoMapper boardMasterDtoMapper;

    @Override
    protected BoardMasterMapper getMapper() {
        return boardMasterMapper;
    }

    public PageResponse<BoardMaster> getAllBoards(int page, int size, String brdNm, String startDate, String endDate) {
        PageHelper.startPage(page, size, "BRD_ID ASC");

        if (startDate != null && !startDate.isEmpty()) {
            startDate = startDate + " 00:00:00";
        }
        if (endDate != null && !endDate.isEmpty()) {
            endDate = endDate + " 23:59:59";
        }

        List<BoardMaster> boards = boardMasterMapper.findAll(brdNm, startDate, endDate);
        PageInfo<BoardMaster> pageInfo = new PageInfo<>(boards);

        return PageResponse.of(pageInfo, boards);
    }

    public BoardMaster getBoardById(String brdId) {
        return super.findById(brdId);
    }

    @Transactional
    public void createBoard(BoardMasterRequest request) {
        if (super.findById(request.getBrdId()) != null) {
            throw new IllegalArgumentException("이미 존재하는 게시판 코드입니다: " + request.getBrdId());
        }
        BoardMaster board = boardMasterDtoMapper.toEntity(request);
        super.create(board);
    }

    @Transactional
    public void updateBoard(BoardMasterRequest request) {
        BoardMaster board = boardMasterDtoMapper.toEntity(request);
        super.update(board);
    }

    @Transactional
    public void deleteBoard(String brdId) {
        super.delete(brdId);
    }
}

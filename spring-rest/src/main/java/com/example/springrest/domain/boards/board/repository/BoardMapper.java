package com.example.springrest.domain.boards.board.repository;

import com.example.springrest.domain.boards.board.model.dto.BoardSearchDto;
import com.example.springrest.domain.boards.board.model.entity.Board;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

import com.example.springrest.global.common.repository.BaseMapper;

@Mapper
public interface BoardMapper extends BaseMapper<Board, Integer> {
    Board findById(@Param("boardId") Integer boardId);

    List<Board> findAll(BoardSearchDto searchDto);

    int insert(Board board);

    int update(Board board);

    int delete(@Param("boardId") Integer boardId);
}

package com.example.springrest.domain.boards.board.model.mapper;

import com.example.springrest.domain.boards.board.model.dto.BoardRequest;
import com.example.springrest.domain.boards.board.model.entity.Board;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

/**
 * 게시글 매퍼 (DTO <-> Entity)
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BoardDtoMapper {

    /**
     * Request -> Entity (Create/Update)
     */
    @Mapping(target = "secretYn", defaultValue = "0")
    @Mapping(target = "useYn", defaultValue = "1")
    Board toEntity(BoardRequest request);
}

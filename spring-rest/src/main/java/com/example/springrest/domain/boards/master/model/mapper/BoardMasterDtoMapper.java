package com.example.springrest.domain.boards.master.model.mapper;

import com.example.springrest.domain.boards.master.model.dto.BoardMasterRequest;
import com.example.springrest.domain.boards.master.model.dto.BoardMasterResponse;
import com.example.springrest.domain.boards.master.model.entity.BoardMaster;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

/**
 * 게시판 마스터 매퍼 (DTO <-> Entity)
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BoardMasterDtoMapper {

    /**
     * Request -> Entity
     */
    @Mapping(target = "replyUseYn", defaultValue = "1")
    @Mapping(target = "fileUseYn", defaultValue = "1")
    @Mapping(target = "fileMaxCnt", defaultValue = "5")
    @Mapping(target = "useYn", defaultValue = "1")
    BoardMaster toEntity(BoardMasterRequest request);

    /**
     * Entity -> Response
     */
    BoardMasterResponse toResponse(BoardMaster entity);

    /**
     * Entity List -> Response List
     */
    List<BoardMasterResponse> toResponseList(List<BoardMaster> entities);
}

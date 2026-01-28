package com.example.springrest.domain.menu.model.mapper;

import com.example.springrest.domain.menu.model.dto.MenuInfoRequest;
import com.example.springrest.domain.menu.model.dto.MenuInfoResponse;
import com.example.springrest.domain.menu.model.entity.MenuInfo;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

/**
 * 메뉴 정보 매퍼 (DTO <-> Entity)
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface MenuMapper {

    /**
     * Request -> Entity
     */
    MenuInfo toEntity(MenuInfoRequest request);

    /**
     * Entity -> Response DTO
     */
    MenuInfoResponse toResponse(MenuInfo entity);

    /**
     * Entity List -> Response DTO List
     */
    List<MenuInfoResponse> toResponseList(List<MenuInfo> entities);
}

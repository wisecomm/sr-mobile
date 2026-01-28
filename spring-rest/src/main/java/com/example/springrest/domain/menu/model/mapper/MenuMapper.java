package com.example.springrest.domain.menu.model.mapper;

import com.example.springrest.domain.menu.model.dto.MenuInfoRequest;
import com.example.springrest.domain.menu.model.entity.MenuInfo;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

/**
 * 메뉴 정보 매퍼 (DTO <-> Entity)
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface MenuMapper {

    /**
     * Request -> Entity
     * useYn: Request에 있으면 사용, 없으면 무시 or 기본값 설정 가능.
     * 여기서는 convertToEntity 로직상 단순 매핑.
     */
    MenuInfo toEntity(MenuInfoRequest request);
}

package com.example.springrest.domain.role.model.mapper;

import com.example.springrest.domain.role.model.dto.RoleInfoRequest;
import com.example.springrest.domain.role.model.dto.RoleInfoResponse;
import com.example.springrest.domain.role.model.entity.RoleInfo;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

/**
 * 역할 정보 매퍼 (DTO <-> Entity)
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface RoleMapper {

    /**
     * Request -> Entity
     */
    RoleInfo toEntity(RoleInfoRequest request);

    /**
     * Entity -> Response DTO
     */
    RoleInfoResponse toResponse(RoleInfo entity);
}

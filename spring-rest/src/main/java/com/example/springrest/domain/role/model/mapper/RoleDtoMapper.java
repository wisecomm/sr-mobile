package com.example.springrest.domain.role.model.mapper;

import com.example.springrest.domain.role.model.dto.RoleInfoRequest;
import com.example.springrest.domain.role.model.dto.RoleInfoResponse;
import com.example.springrest.domain.role.model.entity.RoleInfo;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

/**
 * 역할 정보 DTO 매퍼 (MapStruct)
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface RoleDtoMapper {

    /**
     * Request -> Entity
     */
    RoleInfo toEntity(RoleInfoRequest request);

    /**
     * Entity -> Response DTO
     */
    RoleInfoResponse toResponse(RoleInfo entity);

    /**
     * Entity List -> Response DTO List
     */
    List<RoleInfoResponse> toResponseList(List<RoleInfo> entities);
}

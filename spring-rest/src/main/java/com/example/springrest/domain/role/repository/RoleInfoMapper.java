package com.example.springrest.domain.role.repository;

import com.example.springrest.domain.role.model.entity.RoleInfo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

import com.example.springrest.global.common.repository.BaseMapper;

/**
 * 역할 정보 데이터 접근 매퍼
 */
@Mapper
public interface RoleInfoMapper extends BaseMapper<RoleInfo, String> {
    RoleInfo findById(@Param("roleId") String roleId);

    List<RoleInfo> findAll();

    List<RoleInfo> findAllWithSearch(@Param("searchId") String searchId);

    int insert(RoleInfo roleInfo);

    int update(RoleInfo roleInfo);

    int delete(@Param("roleId") String roleId);
}

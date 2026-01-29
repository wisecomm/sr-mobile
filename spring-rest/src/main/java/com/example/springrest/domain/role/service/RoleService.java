package com.example.springrest.domain.role.service;

import com.example.springrest.domain.role.model.dto.RoleInfoRequest;
import com.example.springrest.domain.role.model.dto.RoleInfoResponse;
import com.example.springrest.domain.role.model.entity.RoleInfo;
import com.example.springrest.domain.role.model.entity.RoleMenuMap;
import com.example.springrest.domain.role.repository.RoleInfoMapper;
import com.example.springrest.domain.role.repository.RoleMenuMapper;
import com.example.springrest.global.model.dto.PageResponse;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import com.example.springrest.global.common.service.BaseService;
import com.example.springrest.domain.role.model.mapper.RoleDtoMapper;

/**
 * 역할 정보 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RoleService extends BaseService<RoleInfo, String, RoleInfoMapper> {

    private final RoleInfoMapper roleInfoMapper;
    private final RoleMenuMapper roleMenuMapper;
    private final RoleDtoMapper roleDtoMapper;

    @Override
    protected RoleInfoMapper getMapper() {
        return roleInfoMapper;
    }

    @Transactional(readOnly = true)
    public List<RoleInfoResponse> getAllRoles() {
        return roleDtoMapper.toResponseList(roleInfoMapper.findAll());
    }

    @Transactional(readOnly = true)
    public PageResponse<RoleInfoResponse> getRolesWithPagination(int page, int size, String searchId) {
        PageHelper.startPage(page, size, "ROLE_ID ASC");

        List<RoleInfo> roles = roleInfoMapper.findAllWithSearch(searchId);
        PageInfo<RoleInfo> pageInfo = new PageInfo<>(roles);

        List<RoleInfoResponse> content = roleDtoMapper.toResponseList(roles);

        return PageResponse.of(pageInfo, content);
    }

    @Transactional(readOnly = true)
    public RoleInfoResponse getRoleById(String roleId) {
        RoleInfo role = super.findById(roleId);
        return role != null ? roleDtoMapper.toResponse(role) : null;
    }

    @Transactional(readOnly = true)
    public List<String> getMenuIdsByRoleId(String roleId) {
        return roleMenuMapper.findByRoleId(roleId).stream()
                .map(RoleMenuMap::getMenuId)
                .toList();
    }

    @Transactional
    public void createRole(RoleInfoRequest request) {
        RoleInfo role = roleDtoMapper.toEntity(request);
        super.create(role);
    }

    @Transactional
    public void updateRole(RoleInfoRequest request) {
        RoleInfo role = roleDtoMapper.toEntity(request);
        super.update(role);
    }

    @Transactional
    public void deleteRole(String roleId) {
        roleMenuMapper.deleteByRoleId(roleId);
        super.delete(roleId);
    }

    @Transactional
    public void assignMenus(String roleId, List<String> menuIds) {
        roleMenuMapper.deleteByRoleId(roleId);
        for (String menuId : menuIds) {
            RoleMenuMap mapping = RoleMenuMap.builder()
                    .roleId(roleId)
                    .menuId(menuId)
                    .useYn("1")
                    .build();
            roleMenuMapper.insert(mapping);
        }
    }
}

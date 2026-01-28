package com.example.springrest.domain.menu.service;

import com.example.springrest.domain.menu.model.dto.MenuInfoRequest;
import com.example.springrest.domain.menu.model.entity.MenuInfo;
import com.example.springrest.domain.menu.repository.MenuInfoMapper;
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
 * 메뉴 정보 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MenuService extends BaseService<MenuInfo, String, MenuInfoMapper> {

    private final MenuInfoMapper menuInfoMapper;
    private final com.example.springrest.domain.menu.model.mapper.MenuMapper menuMapper;

    @Override
    protected MenuInfoMapper getMapper() {
        return menuInfoMapper;
    }

    public List<MenuInfo> getAllMenus() {
        return menuInfoMapper.findAll();
    }

    public PageResponse<MenuInfo> getMenusWithPagination(int page, int size, String searchId) {
        PageHelper.startPage(page, size, "MENU_LVL, MENU_SEQ");

        List<MenuInfo> menus = menuInfoMapper.findAllWithSearch(searchId);
        PageInfo<MenuInfo> pageInfo = new PageInfo<>(menus);

        return PageResponse.of(pageInfo, menus);
    }

    public List<MenuInfo> getMenusByUserId(String userId) {
        return menuInfoMapper.findByUserId(userId);
    }

    public MenuInfo getMenuById(String menuId) {
        return super.findById(menuId);
    }

    @Transactional
    public void createMenu(MenuInfoRequest request) {
        MenuInfo menu = menuMapper.toEntity(request);
        super.create(menu);
    }

    @Transactional
    public void updateMenu(MenuInfoRequest request) {
        MenuInfo menu = menuMapper.toEntity(request);
        super.update(menu);
    }

    @Transactional
    public void deleteMenu(String menuId) {
        super.delete(menuId);
    }
}

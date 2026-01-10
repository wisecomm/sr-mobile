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

/**
 * 메뉴 정보 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuInfoMapper menuInfoMapper;

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
        return menuInfoMapper.findById(menuId);
    }

    @Transactional
    public void createMenu(MenuInfoRequest request) {
        MenuInfo menu = convertToEntity(request);
        menuInfoMapper.insert(menu);
    }

    @Transactional
    public void updateMenu(MenuInfoRequest request) {
        MenuInfo menu = convertToEntity(request);
        menuInfoMapper.update(menu);
    }

    @Transactional
    public void deleteMenu(String menuId) {
        menuInfoMapper.delete(menuId);
    }

    private MenuInfo convertToEntity(MenuInfoRequest request) {
        return MenuInfo.builder()
                .menuId(request.getMenuId())
                .menuLvl(request.getMenuLvl())
                .menuUri(request.getMenuUri())
                .menuImgUri(request.getMenuImgUri())
                .menuName(request.getMenuName())
                .upperMenuId(request.getUpperMenuId())
                .menuDesc(request.getMenuDesc())
                .menuSeq(request.getMenuSeq())
                .useYn(request.getUseYn())
                .build();
    }
}

package com.ssafy.kkalong.api.service;

import com.ssafy.kkalong.api.dto.BrandResponseDto;
import com.ssafy.kkalong.api.dto.ClothesResponseDto;
import com.ssafy.kkalong.api.entity.Brand;
import com.ssafy.kkalong.api.entity.Clothing;
import com.ssafy.kkalong.api.repository.BrandRepository;
import com.ssafy.kkalong.api.repository.ClothingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class FittingService {

    private final BrandRepository brandRepository;
    private final ClothingRepository clothingRepository;

    public List<BrandResponseDto> selectAllBrand() {
        List<Brand> brandList = brandRepository.findAll();
        List<BrandResponseDto> brandDtoList = new ArrayList<>();
        for(Brand b : brandList){
            BrandResponseDto brandDto = new BrandResponseDto();
            brandDto.setBrand_id(b.getId());
            brandDto.setName(b.getKorean_name());
            brandDto.setImg(b.getImg());
            brandDtoList.add(brandDto);
        }
        return brandDtoList;
    }

    public List<Clothing> selectClothesByBrand(int brand_id) {
        Brand brand = brandRepository.findById(brand_id);
        return clothingRepository.findByBrand(brand);
    }

    public ClothesResponseDto selectClothes(int clothing_id) {
        System.out.println("int" + clothing_id);
        Clothing clothes = clothingRepository.findById(clothing_id);
        System.out.println("gege" + clothes.getId());
        ClothesResponseDto clothesDto = new ClothesResponseDto();

        clothesDto.setClothing_id(clothes.getId());
        clothesDto.setImg(clothes.getImg());
        clothesDto.setName(clothes.getName());
        clothesDto.setMainCategory(clothes.getMain_category());
        clothesDto.setUrl(clothes.getUrl());

        return clothesDto;
    }
}

package com.organica.controllers;

import com.organica.payload.ApiResponse;
import com.organica.payload.ProductDto;
import com.organica.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/product")
public class ProductControllers {

    @Autowired
    private ProductService productService;

    // Create Product
    @PostMapping("/add")
    public ResponseEntity<?> createProduct(@RequestParam MultiValueMap<String, String> formData,
                                           @RequestParam("img") MultipartFile file) {
        try {
            ProductDto productDto = new ProductDto();
            productDto.setProductName(formData.getFirst("productname"));
            productDto.setDescription(formData.getFirst("description"));
            productDto.setWeight(Float.parseFloat(formData.getFirst("weight")));
            productDto.setPrice(Float.parseFloat(formData.getFirst("price")));
            productDto.setImg(file.getBytes());

            ProductDto save = productService.CreateProduct(productDto);
            return ResponseEntity.ok(save);

        } catch (IOException | NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse("Invalid input: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Error creating product: " + e.getMessage()));
        }
    }

    // Get by Id (accessible to guest users too)
    @GetMapping("/{productid}")
    public ResponseEntity<?> getById(@PathVariable Integer productid) {
        try {
            ProductDto product = productService.ReadProduct(productid);
            if (product == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse("Product not found"));
            }
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Error fetching product: " + e.getMessage()));
        }
    }

    // Get All Products (accessible to guest users too)
    @GetMapping
    public ResponseEntity<?> getAll() {
        try {
            List<ProductDto> products = productService.ReadAllProduct();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Error fetching products: " + e.getMessage()));
        }
    }

    // Delete Product
    @DeleteMapping("/del/{productId}")
    public ResponseEntity<?> delete(@PathVariable Integer productId) {
        try {
            productService.DeleteProduct(productId);
            return ResponseEntity.ok(new ApiResponse("Product deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Error deleting product: " + e.getMessage()));
        }
    }

    // Update Product
    @PutMapping("/{productId}")
    public ResponseEntity<?> updateProduct(@RequestParam MultiValueMap<String, String> formData,
                                           @RequestParam("img") MultipartFile file,
                                           @PathVariable Integer productId) {
        try {
            ProductDto productDto = new ProductDto();
            productDto.setProductName(formData.getFirst("productname"));
            productDto.setDescription(formData.getFirst("description"));
            productDto.setWeight(Float.parseFloat(formData.getFirst("weight")));
            productDto.setPrice(Float.parseFloat(formData.getFirst("price")));
            productDto.setImg(file.getBytes());

            ProductDto save = productService.UpdateProduct(productDto, productId);
            return ResponseEntity.ok(save);

        } catch (IOException | NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse("Invalid input: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Error updating product: " + e.getMessage()));
        }
    }
}

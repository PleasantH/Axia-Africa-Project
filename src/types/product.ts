import { Types } from 'mongoose';

//books
export type ProductCategory = 
    | 'fiction' 
    | 'non-fiction';

export interface IProduct {
    name: string;
    price: number;
    category: ProductCategory;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateProductRequest {
    name: string;
    price: number;
    category: ProductCategory;
    quantity: number;
}

export interface UpdateProductRequest {
    name?: string;
    price?: number;
    category?: ProductCategory;
    quantity?: number;
}

export interface ProductResponse {
    id: string;
    name: string;
    price: number;
    formattedPrice: string;
    category: ProductCategory;
    quantity: number;
    inStock: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProductQuery {
    category?: ProductCategory;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: 'name' | 'price' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}

export interface PaginatedProductResponse {
    message: string;
    data: ProductResponse[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}
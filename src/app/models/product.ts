export interface Product {
    id: number;
    name: string;
    slug: string;
    color?: string;
    price: number;
    thumbnail: string;
    stock?: number;
    is_featured?: boolean;
    featured?: boolean;
    is_best_seller?: boolean;
    best_seller?: boolean;
    is_new?: boolean;
    new?: boolean;
}
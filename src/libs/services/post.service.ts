import { Feacher } from '../helpers/Feacher';
import { Category } from '../models/category';
import { Post } from '../models/post';

interface props {
  slug?: string;
  cookies?: string;
}
export interface CreatePostDataForm {
  categories: Category[];
  showBack: boolean;
  category: Category;
}
export interface ApiPagination {
  meta: {
    totalCount: number;
    page: number;
    limit: number;
    pageCount: number;
  };
  posts: Post[];
}
export default async function getCreatePostForm({ slug, cookies }: props) {
  try {
    const response = await Feacher<CreatePostDataForm>('/post/create', {
      method: 'GET',
      cache: 'no-store',
      next: { tags: [`category-post-${slug}`] },
      params: {
        slug: slug || '',
      },
      headers: {
        ...(cookies && { cookies }),
      },
    });
    return response;
  } catch (error) {
    console.error('Error fetching create post form:', error);
    throw error;
  }
}

interface GetPostsProps {
  search?: string;
  categorySlug?: string;
  city?: string;
  options?: Record<string, any>;
  priceRange?: string;
  chat?: boolean;
  hasImasge?: boolean;
  page?: number;
  limit?: number;
}
export async function GetPosts({
  search,
  categorySlug,
  page,
  limit,
  chat,
  city,
  options,
  hasImasge,
  priceRange,
}: GetPostsProps) {
  const res = await Feacher<ApiPagination>('/post/search', {
    params:{
      page: page?.toString() || '1',
      limit: limit?.toString() || '10',
    },
    method: 'POST',
    cache: 'no-store',
    body: JSON.stringify({
      search,
      chat,
      city,
      options,
      hasImasge,
      priceRange,
      categorySlug
    }),
  });
  return res;
}
export async function GetSinglePostBySlug(slug:string){

  const res=await Feacher<{post:Post}>(`/post/get-by-slug/${slug}`)
  if(!res) return null;
  return res.post;
}
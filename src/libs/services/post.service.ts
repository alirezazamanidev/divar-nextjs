import { Feacher } from "../helpers/Feacher";
import { Category } from "../models/category";

interface props {
  slug?: string;
  cookies?: string;
}
export interface CreatePostDataForm{
    categories:Category[]
    showBack:boolean
    category:Category

}
export default async function getCreatePostForm({ slug, cookies }: props) {
  try {
    
    const response=await Feacher<CreatePostDataForm>('/post/create',{
        method:"GET",
        cache:'no-store',
        next:{tags:[`category-post-${slug}`]},
        params:{
            slug:slug || '',
        },
        headers:{
            ...(cookies &&{cookies})
        }
    })
    return response;
  } catch (error) {
    console.error('Error fetching create post form:', error);
    throw error;
  }
}

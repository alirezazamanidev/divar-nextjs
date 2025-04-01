import { Feacher } from "../helpers/Feacher"
import { Category } from "../models/category"
import { FormField } from "../models/formFiled"

export interface ListCategories{
  currentCategory:Category, 
  categories:Category[],     
  options:FormField[],         
  showBack:boolean, 
}
export const getCategories = async ({slug}:{slug?:string}) => {

    const res=await Feacher<ListCategories>('/category/list',{
      method:"GET",
      params:{
        slug:slug??''
      }
    })
    return res;
}
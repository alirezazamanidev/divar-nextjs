import { File } from "./file";
import { FormField } from "./formFiled";

export interface Category {
  id: string;
  title: string;
  slug: string;
  formFields: FormField[];
  parentId: number;
  children: Category[];
  icon: File;
}
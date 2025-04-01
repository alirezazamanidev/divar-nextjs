import CategorySearch from '@/components/home/CategorySearch';
import getCreatePostForm, {
  CreatePostDataForm,
} from '@/libs/services/post.service';
import { cookies } from 'next/headers';
import { Category } from '@/libs/models/category';
import InnerCreateForm from '@/components/post/create/InnerCreateForm';
import CreatePostForm from '@/libs/forms/post/CreatePostForm';
import { FormField } from '@/libs/models/formFiled';

export default async function NewPostPage({
  searchParams,
}: {
  searchParams:Promise<{ slug: string }>
}) {
  const {slug} = await searchParams;
  const cookieStore = await cookies();

  const cookieString = cookieStore.toString();

  const {category,categories,showBack}: CreatePostDataForm = await getCreatePostForm({
    cookies: cookieString,
    slug: slug || undefined,
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-right">ثبت آگهی</h1>

        <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
          {category?.formFields &&
          category.formFields.length > 0 ? (
            <CreatePostForm category={category} />
          ) : (
            <CategorySearch createPostData={{categories,showBack,category}} />
          )}
        </div>
      </div>
    </div>
  );
}

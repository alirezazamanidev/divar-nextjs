import { GetSinglePostBySlug } from '@/libs/services/post.service';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params:Promise<{ slug: string }>;
}) {
  const { slug } =await params;
  const post = await GetSinglePostBySlug(slug);
  if (!post) notFound();
  return { title: post.title };
}

export default function SinglePostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="min-h-screen">{children}</main>;
}

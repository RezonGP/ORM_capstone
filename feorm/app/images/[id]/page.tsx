import ImageDetail from '@/components/images/image-detail';

export default function ImageDetailPage({ params }: { params: { id: string } }) {
  return <ImageDetail id={params.id} />;
}

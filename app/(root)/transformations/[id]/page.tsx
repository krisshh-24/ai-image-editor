import { getImagebyId } from "@/lib/actions/image.action";
import TransformedImageClient from "@/components/shared/TransformedImageClient";

export default async function TransformationPage({ params }: { params: { id: string } }) {
  const image = await getImagebyId(params.id);

  return (
    <div>
      <TransformedImageClient image={image} />
    </div>
  );
}
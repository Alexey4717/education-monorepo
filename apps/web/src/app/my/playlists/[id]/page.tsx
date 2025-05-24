import { SinglePl } from './SinglePl';
import type { TPageIdProp } from '@/types/page.types';

export default async function Page({ params }: TPageIdProp) {
	const id = (await params).id;

	return <SinglePl id={id} />;
}

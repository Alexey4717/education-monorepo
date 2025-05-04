import { Compass, Flame } from 'lucide-react';
import type { Metadata } from 'next';
import { Heading } from '@/ui/Heading';
import { VideoItem } from '@/ui/video-item/VideoItem';
import { PAGE } from '@/config/public-page.config';
import { Explore } from '@/app/(public)/explore/Explore';
import { videoService } from '@/services/video.service';

export const revalidate = 100;
export const dynamic = 'force-static';

export const metadata: Metadata = {
	title: 'HOME',
	description: 'Hub for sharing video/blogs/posts',
	alternates: {
		canonical: PAGE.HOME,
	},
	openGraph: {
		type: 'website',
		url: PAGE.HOME,
		title: 'HOME',
	},
};

/**
 * Immitation fetching data in server (trending) and in client (explore)
 * @constructor
 */
export default async function Videos() {
	const data = await videoService.getExploreVideos();

	const videos = (data?.data ?? []).splice(0, 6);

	return (
		<section>
			<section className="mb-10">
				<Heading Icon={Compass}>Trending</Heading>
				<div className="grid grid-cols-6 gap-6">
					{videos.length &&
						videos.map((video) => (
							<VideoItem
								key={video.id}
								video={video}
								Icon={Flame}
							/>
						))}
				</div>
			</section>
			<Explore />
		</section>
	);
}

'use client';

import { useQuery } from '@tanstack/react-query';
import { Flame } from 'lucide-react';
import { VideoItem } from '@/ui/video-item/VideoItem';
import { videoService } from '@/services/video.service';

export default function Home() {
	const { data, isLoading } = useQuery({
		queryKey: ['explore'], // ключ, по которому запись в кеш
		queryFn: () => videoService.getExploreVideos(),
	});

	return (
		<div className="grid grid-cols-6 gap-6">
			{isLoading
				? 'Loading...'
				: data?.data.length &&
					data.data.map((video) => (
						<VideoItem key={video.id} video={video} Icon={Flame} />
					))}
		</div>
	);
}

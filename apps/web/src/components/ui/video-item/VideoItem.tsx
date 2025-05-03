import { type LucideIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PAGE } from '@/config/public-page.config';
import { transformDate } from '@/utils/transform-date';
import { transformViews } from '@/utils/transform-views';
import type { IVideo } from '@/types/video.types';

interface Props {
	video: IVideo;
	Icon?: LucideIcon;
}

export function VideoItem({ video, Icon }: Props) {
	return (
		<div style={{ width: 'fit-content' }}>
			<div className="relative mb-1.5">
				<Link href={PAGE.VIDEO(video.id)}>
					<Image
						src="/img.png" // TODO возможно сделать на сервере
						width={250}
						height={140}
						alt={video.title}
						className="rounded-md"
					/>
				</Link>
			</div>
			<div className="mb-1.5 flex items-center justify-between">
				<div className="flex items-center gap-0.5">
					{Icon && <Icon className="text-red-600" size={20} />}
					{/* TODO remove */}
					<span className="text-gray-400 text-sm">
						{/* TODO сделать это на бэке */}
						{transformViews(
							Math.floor(Math.random() * (2000000 - 0 + 1))
						)}
					</span>
				</div>
				<div>
					<span className="text-gray-400 text-xs">
						{transformDate(video.createdAt)}
					</span>
				</div>
			</div>
			<div className="mb-1">
				<Link
					href={PAGE.VIDEO(video.id)}
					className="line-clamp-2 leading-[1.3]"
				>
					{video.title}
				</Link>
			</div>
		</div>
	);
}

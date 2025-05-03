import axios from 'axios';
import type { IVideo } from '@/types/video.types';

class VideoService {
	getExploreVideos() {
		return axios.get<IVideo[]>('http://localhost:3001/videos');
	}
}

export const videoService = new VideoService();

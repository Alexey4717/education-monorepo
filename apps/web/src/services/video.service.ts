import axios from 'axios';
import type { IVideo } from '@/types/video.types';

class VideoService {
    getExploreVideos(searchTerm?: string | null) {
        return axios.get<IVideo[]>(
            'http://localhost:3001/videos',
            searchTerm
                ? {
                    params: {
                        searchTerm,
                    },
                }
                : {},
        );
    }
}

export const videoService = new VideoService();

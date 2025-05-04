class PublicPage {
    HOME = '/';
    TRENDING = '/trending';
    VIDEO_GAMES = '/video-games';

    MY_CHANNEL = '/my-channel';
    SUBSCRIPTIONS = '/subscriptions';
    HISTORY = '/history';
    LIKED_VIDEOS = '/liked-videos';

    FEEDBACK = '/feedback';

    VIDEO(path: string) {
        return `/v/${path}`;
    }

    SEARCH(searchTerm: string) {
        return `/s?term=${searchTerm}`;
    }
}

export const PAGE = new PublicPage();

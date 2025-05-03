class PublicPage {
    HOME = '/';
    TRENDING = '/trending';
    VIDEO_GAMES = '/video-games';

    SEARCH = '/search';

    MY_CHANNEL = '/my-channel';
    SUBSCRIPTIONS = '/subscriptions';
    HISTORY = '/history';
    LIKED_VIDEOS = '/liked-videos';

    SETTINGS = '/settings';
    FEEDBACK = '/feedback';

    VIDEO(path: string) {
        return `/v/${path}`;
    }
}

export const PAGE = new PublicPage();

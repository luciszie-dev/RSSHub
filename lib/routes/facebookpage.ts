import { Route } from '@/types';
import got from '@/utils/got';

export const route: Route = {
    path: '/page/:id',
    categories: ['social-media'],
    example: '/facebook/page/locket.asia',
    parameters: { id: 'Page username or ID' },
    features: {
        requireConfig: false,
        requirePuppeteer: false,
        antiSpider: false,
        supportBT: false,
        supportPodcast: false,
        supportScihub: false,
    },
    name: 'Facebook Page via RSS-Bridge',
    maintainers: ['luciszie-dev'],
    handler: async (ctx) => {
        const id = ctx.req.param('id');
        // Sử dụng backend RSS-Bridge công khai để cào dữ liệu Facebook ổn định
        const bridgeUrl = `https://rss-bridge.org/bridge01/?action=display&bridge=FacebookBridge&u=${id}&format=Json`;
        
        const response = await got({
            method: 'get',
            url: bridgeUrl,
        });

        const data = response.data;

        return {
            title: `Facebook - ${id}`,
            link: `https://www.facebook.com/${id}`,
            item: data.items.map((item) => ({
                title: item.title || item.content_text?.substring(0, 50) || 'Bài viết mới',
                description: item.content_html || item.content_text,
                pubDate: item.date_published,
                link: item.url,
                guid: item.id,
            })),
        };
    },
};

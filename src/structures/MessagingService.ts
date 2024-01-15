import { baseApiUrl } from '../util/constants';

export class MessagingService {
    public readonly apiKey: string;
    public readonly universeId: number;

    /**
     * @param apiKey Your Open Cloud API key.
     * @param universeId The identifier of the experience in which you want to send your messages to. You can [copy your experience's Universe ID](https://create.roblox.com/docs/cloud/open-cloud/usage-messaging#publishing-messages-to-live-servers) on Creator Dashboard.
     */
    constructor(apiKey: string, universeId: number) {
        this.apiKey = apiKey;
        this.universeId = universeId;
    }

    /**
     * Publish a message to a pre-defined topic of an experience, with the size of the message up to 1,024 characters (1 KB).
     * Requires the Publish permission for API keys and the universe-messaging-service:publish scope for OAuth 2.0 apps.
     * See [Cross-Server Messaging](https://create.roblox.com/docs/cloud-services/cross-server-messaging#subscribe-users-to-receive-messages) for defining and subscribing users to a topic.
     *
     * @param topic The topic that you want to publish your message to, with up to 80 characters.
     * @param message The message content that you want to publish to the live server.
     */
    public async publish(topic: string, message: any) {
        const endpoint = new URL(`/messaging-service/v1/universes/${this.universeId}/topics/${topic}`, baseApiUrl);
        if (typeof message === 'object') message = JSON.stringify(message);

        return new Promise<boolean>(async (res, rej) => {
            // Topics are only allowed up to 80 characters.
            if (topic.length > 80) {
                throw new Error(`Expected topic to be 80 characters, got ${topic.length}.`);
            }

            // Messages are only allowed up to 1024 characters.
            if (message.length > 1024) {
                throw new Error(`Expected message to be 1024 characters, got ${message.length}.`);
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'x-api-key': this.apiKey,
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ message })
            });

            if (!response.ok) {
                return rej(false);
            }

            return res(true);
        }).catch((response: boolean) => response);
    }
}

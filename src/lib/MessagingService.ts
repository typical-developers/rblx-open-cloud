import { baseApiUrl } from "../util/constants";

export class MessagingService {
    readonly apiKey: string;
    readonly universeId: number;

    /**
     * @param key Your Open Cloud API key.
     * @param universeId The Universe ID that you want to manage datastores for.
     */
    constructor(key: string, universeId: number) {
        this.apiKey = key;
        this.universeId = universeId;
    }

    /**
     * Publish a message to a pre-defined topic of an experience, with the size of the message up to 1,024 characters (1 KB).
     * @link https://create.roblox.com/docs/reference/cloud/messaging-service/v1#POST-v1-universes-_universeId_-topics-_topic_
     * @param topic The topic that you want to publish your message to, with up to 80 characters.
     * @param message The message content that you want to publish to the live server.
     * @returns Whether or not the message was successfully sent.
     */
    public async publish<T>(topic: string, message: T | object) {
        const url = new URL(`/v1/universes/${this.universeId}/topics/${topic}`, baseApiUrl);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                'content-type': 'application/json',
				'x-api-key': this.apiKey
            },
            body: JSON.stringify({ message })
        });

        if (!response.ok) {
            return false;
        }

        return true;
    }
}
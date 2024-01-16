import { Client, IMessage, StompConfig } from '@stomp/stompjs';
import { EventEmitter } from 'events';

type EventCallback<T = any> = (...args: T[]) => void;

type EventMessageBody = { event: string, data: any };

const PUBLIC_RABBIT_ENV = {
    HOST: process.env.NEXT_PUBLIC_RABBITMQ_HOST!,
    PORT: process.env.NEXT_PUBLIC_RABBITMQ_PORT!,
    VHOST:process.env.NEXT_PUBLIC_RABBITMQ_VHOST!,
    USER: process.env.NEXT_PUBLIC_RABBITMQ_USER!,
    PASSWORD: process.env.NEXT_PUBLIC_RABBITMQ_PASSWORD!,
    EXCHANGE: process.env.NEXT_PUBLIC_RABBITMQ_EXCHNGE!,
}

class RMQClient {
    private static _instance: RMQClient;
    private stompClient: Client;
    private destinations: string[] = [];
    private clientSettings: StompConfig = {
        brokerURL: `ws://${PUBLIC_RABBIT_ENV.HOST}:${PUBLIC_RABBIT_ENV.PORT}/ws`,
        connectHeaders: {
            login: PUBLIC_RABBIT_ENV.USER,
            passcode: PUBLIC_RABBIT_ENV.PASSWORD,
            host: PUBLIC_RABBIT_ENV.VHOST,
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
    };

    public static get instance(): RMQClient {
        if (RMQClient._instance === undefined) {
            RMQClient._instance = new RMQClient();
        }
        return RMQClient._instance;
    }

    private readonly emitter = new EventEmitter();

    private callback = (message: IMessage): void => {
        // console.log('receive message:', message.body);
        const jsonBody: EventMessageBody = JSON.parse(message.body);
        this.emitter.emit(jsonBody.event, jsonBody.data);
    };

    constructor(conf?: StompConfig) {
        if (conf !== undefined) {
            this.clientSettings = conf;
        };
        this.stompClient = new Client(this.clientSettings);
        
        // Error handling
        this.stompClient.onStompError = (frame) => {
            console.log('Broker reported error: ' + frame.headers['message'])
            console.log('Additional details: ' + frame.body)
        };

        this.stompClient.onDisconnect = () => {
            console.log('Connection Terminated')
        };

        this.stompClient.onWebSocketClose = (closeEevent) => {
            console.log('Websocket Terminated!!')
            console.log(`Reason: ${closeEevent.reason}`)
            console.log(`Code: ${closeEevent.code}`)
        };

        this.stompClient.activate();
    };

    public publish(channel: string, event: string, data: any): void {
        if (this.stompClient) {
            const params = {
                destination: `/exchange/${PUBLIC_RABBIT_ENV.EXCHANGE}/${channel}`,
                body: JSON.stringify({ event: event, data: data }),
            };
            this.stompClient.publish(params);
        }
    };

    public subscribe(channel: string): string[] {
        let subscribeId: string = "";
        if (!this.destinations.includes(channel))
            this.destinations.push(channel);
        this.disconnnect();
        this.stompClient.onConnect = () => {
            this.destinations.forEach(ch => {
                this.stompClient.subscribe(`/exchange/${PUBLIC_RABBIT_ENV.EXCHANGE}/${ch}`, this.callback, { id: ch });
            });
        };
        this.connnect();

        return this.destinations;
    };

    public unsubscribe(channel: string): void {
        this.disconnnect();
        if (!this.destinations.includes(channel))
            this.destinations = this.destinations.filter(item => item != channel);

        this.stompClient.onConnect = () => {
            this.destinations.forEach(ch => {
                this.stompClient.unsubscribe(`/exchange/${PUBLIC_RABBIT_ENV.EXCHANGE}/${ch}`, { id: ch });
            });
        };

        this.connnect();
        return;
    };

    public bind(event: string, callback: EventCallback): string {
        this.emitter.addListener(event, callback);
        return "";
    };

    public unbind(event: string, callback: EventCallback): void {
        this.emitter.removeListener(event, callback);
        return;
    };

    public unbindall(event: string): void {
        this.emitter.removeAllListeners(event);
        return;
    };

    public connnect(): void {
        if (!this.stompClient.active)
            this.stompClient.activate();
    };

    public disconnnect(): void {
        if (this.stompClient.active)
            this.stompClient.deactivate();
    };
}

export const RMQC = RMQClient.instance;

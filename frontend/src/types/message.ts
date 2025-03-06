export interface Message {
    id: number;
    content: string;
    sender: 'user' | 'bot';
    created_at: string;
    updated_at: string;
    parent_message_id?: number;
}

/** Association type */
export declare enum LabelAssociationType {
    Chat = "label_jid",
    Message = "label_message"
}
export type LabelAssociationTypes = `${LabelAssociationType}`;
/** Association for chat */
export interface ChatLabelAssociation {
    type: LabelAssociationType.Chat;
    chatId: string;
    labelId: string;
}
/** Association for message */
export interface MessageLabelAssociation {
    type: LabelAssociationType.Message;
    chatId: string;
    messageId: string;
    labelId: string;
}
export type LabelAssociation = ChatLabelAssociation | MessageLabelAssociation;
/** Body for add/remove chat label association action */
export interface ChatLabelAssociationActionBody {
    labelId: string;
}
/** body for add/remove message label association action */
export interface MessageLabelAssociationActionBody {
    labelId: string;
    messageId: string;
}
//# sourceMappingURL=LabelAssociation.d.ts.map
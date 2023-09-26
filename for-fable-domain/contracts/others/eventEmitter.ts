import { PromptEntity } from "../../entities";

export interface EventEmitter {
    emitRunPromptEvent(prompt: PromptEntity): Promise<void>
}
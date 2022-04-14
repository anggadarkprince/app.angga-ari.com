import {Injectable} from "@nestjs/common";
import {OnEvent} from "@nestjs/event-emitter";
import {ON_USER_REGISTERED, UserRegisterEvent} from "../events/user-register.event";
import {MailService} from "../../mail/mail.service";
import {UtilityService} from "../../utility/utility.service";
import {randomBytes} from "crypto";

@Injectable()
export class UserRegisterListener {
    constructor(
        private mailService: MailService,
        private utilityService: UtilityService
    ) {
    }

    @OnEvent(ON_USER_REGISTERED)
    async handleOrderCreatedEvent(event: UserRegisterEvent) {
        const meta = randomBytes(8).toString('hex');
        const token = meta + '.' + this.utilityService.encrypt(event.user.email).encryptedData;
        await this.mailService.sendUserConfirmation(event.user, token);
    }
}
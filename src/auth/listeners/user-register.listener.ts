import {Injectable} from "@nestjs/common";
import {OnEvent} from "@nestjs/event-emitter";
import {ON_USER_REGISTERED, UserRegisterEvent} from "../events/user-register.event";
import {MailService} from "../../mail/mail.service";
import {UtilityService} from "../../utility/utility.service";

@Injectable()
export class UserRegisterListener {
    constructor(
        private mailService: MailService,
        private utilityService: UtilityService
    ) {
    }

    @OnEvent(ON_USER_REGISTERED)
    async handleOrderCreatedEvent(event: UserRegisterEvent) {
        const today = new Date();
        const expiredDate = today.setHours(today.getHours() + 24);
        const payload = JSON.stringify({
            email: event.user.email,
            type: 'account_activation',
            expiredAt: expiredDate
        });
        const encryptedToken = this.utilityService.encrypt(payload);
        const encodedToken = Buffer.from(JSON.stringify(encryptedToken)).toString('base64');
        await this.mailService.sendUserConfirmation(event.user, encodedToken);
    }
}
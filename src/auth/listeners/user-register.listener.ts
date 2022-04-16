import {Injectable} from "@nestjs/common";
import {OnEvent} from "@nestjs/event-emitter";
import {ON_USER_REGISTERED, UserRegisterEvent} from "../events/user-register.event";
import {MailService} from "../../mail/mail.service";
import {UtilityService} from "../../utility/utility.service";
import {TOKEN_ACCOUNT_ACTIVATION, TOKEN_RESET_PASSWORD} from "../constants/auth";
import {ON_USER_FORGOT_PASSWORD, UserForgotPasswordEvent} from "../events/user-forgot-password.event";

@Injectable()
export class UserRegisterListener {
    constructor(
        private mailService: MailService,
        private utilityService: UtilityService
    ) {
    }

    /**
     * Generate token by email and type.
     *
     * @param email
     * @param type
     * @param hours
     * @private
     */
    private static generateToken(email: string, type: string, hours = 24) {
        const today = new Date();
        const expiredDate = today.setHours(today.getHours() + hours);
        return JSON.stringify({
            email: email,
            type: type,
            expiredAt: expiredDate
        });
    }

    /**
     * Generate and encode token to base64.
     *
     * @param email
     * @param type
     * @param hours
     * @private
     */
    private encodeEncryptedData(email: string, type: string, hours = 24) {
        const payload = UserRegisterListener.generateToken(email, type, hours);
        const encryptedToken = this.utilityService.encrypt(payload);
        return Buffer.from(JSON.stringify(encryptedToken)).toString('base64');
    }

    @OnEvent(ON_USER_REGISTERED)
    async handleUserRegisteredEvent(event: UserRegisterEvent) {
        const encodedToken = this.encodeEncryptedData(event.user.email, TOKEN_ACCOUNT_ACTIVATION);

        await this.mailService.sendUserConfirmation(event.user, encodedToken);
    }

    @OnEvent(ON_USER_FORGOT_PASSWORD)
    async handleUserForgotPasswordEvent(event: UserForgotPasswordEvent) {
        const encodedToken = this.encodeEncryptedData(event.user.email, TOKEN_RESET_PASSWORD);

        await this.mailService.sendResetPasswordLink(event.user, encodedToken);
    }
}
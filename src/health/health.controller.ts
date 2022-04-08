import {Controller, Get} from '@nestjs/common';
import {HealthCheck, HealthCheckService, HttpHealthIndicator} from "@nestjs/terminus";
import {ConfigService} from "@nestjs/config";

@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private http: HttpHealthIndicator,
    ) {
    }

    @Get()
    @HealthCheck()
    check() {
        return this.health.check([
            () => this.http.pingCheck("angga's-website", 'https://angga-ari.com')
        ])
    }

}

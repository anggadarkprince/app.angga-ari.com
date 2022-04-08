import {Controller, Get} from '@nestjs/common';
import {HealthCheck, HealthCheckService, HealthServiceCheck, HttpHealthIndicator} from "@nestjs/terminus";

@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private http: HttpHealthIndicator
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

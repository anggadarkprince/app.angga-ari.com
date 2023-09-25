import { SetMetadata } from '@nestjs/common';
import { ALLOW_GUEST } from '../constants/auth';

export const AllowGuest = () => SetMetadata(ALLOW_GUEST, true);

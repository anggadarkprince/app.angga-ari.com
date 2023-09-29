import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(@InjectRepository(Profile) private repo: Repository<Profile>) {}

  async findOne(id: number) {
    const profile = await this.repo.findOne({
      where: { id: +id },
    });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  async findUserProfile(userId: number) {
    const profile = await this.repo.findOne({
      where: { user_id: userId },
    });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  async updateUserProfile(userId: number, updateProfileDto: UpdateProfileDto) {
    let userProfile: Profile = null;
    try {
      userProfile = await this.findUserProfile(userId);
    } catch (e) {
      if (e instanceof NotFoundException) {
        const newProfile = this.repo.create(updateProfileDto);
        newProfile.user_id = userId;
        return this.repo.save(newProfile);
      }
    }

    if (userProfile) {
      console.log('profile not found, create new one');
      Object.assign(userProfile, updateProfileDto);

      return this.repo.save(userProfile);
    }
    throw new HttpException('Something went wrong', 500);
  }
}

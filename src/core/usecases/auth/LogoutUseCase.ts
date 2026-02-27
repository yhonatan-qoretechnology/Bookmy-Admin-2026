import type { AuthRepository } from '../../domain/auth/AuthRepository';

export class LogoutUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(): Promise<void> {
    console.log('LogoutUseCase: executing logout');
    await this.authRepository.logout();
    console.log('LogoutUseCase: logout completed');
  }
}

import type { AuthRepository } from '../../domain/auth/AuthRepository';
import type {
  LoginRequestDto,
  LoginResponseDto,
} from '../../domain/auth/AuthTypes';

export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(credentials: LoginRequestDto): Promise<LoginResponseDto> {
    const result = await this.authRepository.login(credentials);

    // Aquí podemos aplicar reglas de negocio, por ejemplo:
    // si el rol es CLIENT, no permitir acceso al admin.
    if ((result.user as any).role === 'CLIENT') {
      throw new Error('Este usuario es cliente (móvil) y no tiene acceso al panel admin');
    }

    return result;
  }
}

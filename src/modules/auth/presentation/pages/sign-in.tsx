import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import { TextInput } from "@/shared/ui/components/form/text-input";
import { BaseButton } from "@/shared/ui/components/form/base-button";
import { Separator } from "@/shared/ui/components/ui/separator";
import { HeaderLogin } from "../components/header";

import { loginSchema, type LoginFormData } from "../schemas/login-schema";
import { makeLoginUserUseCase } from "../../container";
import { translateAuthError } from "@/shared/utils/translate/translate-auth-error";

export function SignIn() {
  const loginUserUseCase = makeLoginUserUseCase();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    try {
      await loginUserUseCase.execute(data);

      toast.success("Login realizado com sucesso 🎉", {
        description: "Bem-vindo de volta!",
        position: "bottom-center",
      });

      navigate("/");
    } catch (error: any) {
      toast.error("Erro ao entrar", {
        description: translateAuthError(error),
        position: "bottom-center",
      });
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between items-center bg-background">
      <HeaderLogin />

      <main
        className="w-full flex justify-center"
        aria-labelledby="signin-title"
      >
        <div className="w-full max-w-md p-6 sm:p-8 flex flex-col gap-8 bg-card rounded-lg shadow">
          <header className="flex flex-col gap-2">
            <h1
              id="signin-title"
              className="text-center text-heading-lg font-bold text-high-contrast"
            >
              Bem-vindo de volta
            </h1>

            <p className="text-center text-body text-muted">
              Acesse sua conta para continuar focado.
            </p>
          </header>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2 w-full"
            aria-label="Formulário de login"
          >
            <TextInput
              label="E-mail"
              type="email"
              placeholder="Digite seu e-mail"
              {...register("email")}
              error={errors.email?.message}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />

            <TextInput
              label="Senha"
              type="password"
              placeholder="Digite sua senha"
              {...register("password")}
              error={errors.password?.message}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
            />

            <BaseButton
              className="mt-6 w-full flex items-center justify-center gap-2 cursor-pointer"
              type="submit"
              loading={isSubmitting}
              aria-busy={isSubmitting}
            >
              Entrar
            </BaseButton>
          </form>

          <Separator />

          <p className="text-body text-muted text-center">
            Ainda não tem uma conta?{" "}
            <Link
              className="underline text-body text-primary font-bold"
              to="/sign-up"
            >
              Cadastre-se agora
            </Link>
          </p>
        </div>
      </main>

      <footer className="flex items-center h-20">
        <span className="text-center text-muted-light text-body-sm">
          © {new Date().getFullYear()} MindEase Focus. Projetado para sua
          tranquilidade.
        </span>
      </footer>
    </div>
  );
}

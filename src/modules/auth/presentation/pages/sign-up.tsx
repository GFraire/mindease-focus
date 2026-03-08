import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "@/shared/ui/components/form/text-input";
import { BaseButton } from "@/shared/ui/components/form/base-button";
import { Separator } from "@/shared/ui/components/ui/separator";
import { translateAuthError } from "@/shared/utils/translate/translate-auth-error";
import { HeaderLogin } from "../components/header";

import {
  registerSchema,
  type RegisterFormData,
} from "../schemas/register-schema";

import { makeRegisterUserUseCase } from "../../container";
import { useMemo } from "react";

export function SignUp() {
  const registerUserUseCase = useMemo(() => makeRegisterUserUseCase(), []);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormData) {
    try {
      await registerUserUseCase.execute(data);

      toast.success("Conta criada com sucesso 🎉", {
        description: "Bem-vindo ao MindEase Focus!",
        position: "bottom-center",
      });

      navigate("/");
    } catch (error: any) {
      toast.error("Erro ao criar conta", {
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
        aria-labelledby="signup-title"
      >
        <div className="w-full max-w-md p-6 sm:p-8 flex flex-col gap-8 bg-card rounded-lg shadow">
          <header className="flex flex-col gap-2">
            <h1
              id="signup-title"
              className="text-center text-heading-lg font-bold text-high-contrast"
            >
              Comece sua jornada
            </h1>

            <p className="text-center text-body text-muted">
              Sua jornada para o foco e bem-estar <br />
              começa aqui.
            </p>
          </header>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2 w-full"
            aria-label="Formulário de criação de conta"
          >
            <TextInput
              label="Nome completo"
              placeholder="Digite seu nome"
              {...register("fullName")}
              error={errors.fullName?.message}
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? "fullname-error" : undefined}
            />

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
              label="Crie uma senha"
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
              Criar conta
            </BaseButton>
          </form>

          <Separator />

          <p className="text-body text-muted text-center">
            Já tem uma conta?{" "}
            <Link
              className="underline text-body text-primary font-bold"
              to="/sign-in"
            >
              Entrar
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

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "@/shared/ui/components/form/text-input";
import { BaseButton } from "@/shared/ui/components/form/base-button";
import { Separator } from "@/shared/ui/components/ui/separator";
import { useAuthStore } from "@/shared/ui/store/auth-store";
import { HeaderLogin } from "../components/header";
import {
  registerSchema,
  type RegisterFormData,
} from "../schemas/register.schema";
import { makeRegisterUserUseCase } from "../../container";

export function SignUp() {
  const registerUserUseCase = makeRegisterUserUseCase();

  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  async function onSubmit(data: RegisterFormData) {
    try {
      await registerUserUseCase.execute(data);

      toast.success("Conta criada com sucesso 🎉", {
        description: "Bem-vindo ao MindEase Focus!",
        position: "bottom-center",
      });
    } catch (error: any) {
      toast.error("Erro ao criar conta", {
        description: translateFirebaseError(error),
        position: "bottom-center",
      });
    }
  }

  function translateFirebaseError(error: any): string {
    switch (error.code) {
      case "auth/email-already-in-use":
        return "Este e-mail já está em uso.";

      case "auth/invalid-email":
        return "E-mail inválido.";

      case "auth/weak-password":
        return "A senha deve ter no mínimo 6 caracteres.";

      default:
        return "Ocorreu um erro inesperado.";
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between items-center bg-background">
      <HeaderLogin />

      <div className="w-full max-w-md p-6 sm:p-8 flex flex-col gap-8 bg-card rounded-lg shadow">
        <div className="flex flex-col gap-2">
          <span className="text-center text-heading-lg font-bold text-high-contrast">
            Comece sua jornada
          </span>

          <span className="text-center text-body text-muted">
            Sua jornada para o foco e bem-estar <br /> começa aqui.
          </span>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2 w-full"
        >
          <TextInput
            label="Nome completo"
            placeholder="Digite seu nome"
            {...register("fullName")}
            error={errors.fullName?.message}
          />

          <TextInput
            label="E-mail"
            type="email"
            placeholder="Digite seu e-mail"
            {...register("email")}
            error={errors.email?.message}
          />

          <TextInput
            label="Crie uma senha"
            type="password"
            placeholder="Digite sua senha"
            {...register("password")}
            error={errors.password?.message}
          />

          <BaseButton
            className="mt-6 w-full flex items-center justify-center gap-2 py-5"
            type="submit"
            loading={isSubmitting}
          >
            Criar conta
          </BaseButton>
        </form>

        <Separator />

        <span className="text-body text-muted text-center">
          Já tem uma conta?{" "}
          <Link
            className="underline text-body text-primary font-bold"
            to="/sign-in"
          >
            Entrar
          </Link>
        </span>
      </div>

      <div className="flex items-center h-20">
        <span className="text-center text-muted-light text-body-sm">
          © {new Date().getFullYear()} MindEase Focus. Projetado para sua
          tranquilidade.
        </span>
      </div>
    </div>
  );
}

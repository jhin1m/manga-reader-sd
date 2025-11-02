import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { Spinner } from "@/components/ui/spinner";

function LoginFormFallback() {
  return (
    <div className="flex items-center justify-center p-8">
      <Spinner className="h-8 w-8" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFormFallback />}>
      <LoginForm />
    </Suspense>
  );
}

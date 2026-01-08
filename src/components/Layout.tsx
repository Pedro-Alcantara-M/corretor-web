import { Outlet } from "react-router-dom";
import { Button } from "./ui";
import { LogOut } from "lucide-react";
import { logout } from "@services/auth/auth.service";

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full flex flex-row justify-between space-y-4 px-10 pt-4 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex flex-col align-start">
          <h1 className="text-lg font-bold text-foreground">EnemCorretor</h1>
          <p className="text-sm text-muted-foreground">
            Plataforma de Correção de Redações ENEM
          </p>
        </div>

        <Button onClick={logout} variant="outline"><LogOut /> Sair</Button>
      </header>
      <main className="flex-grow p-4">
        <Outlet />
      </main>
      <footer className="bg-gray-200 text-center p-4">
        &copy; {new Date().getFullYear()} My Application
      </footer>
    </div>
  );
};

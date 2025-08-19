/* eslint-disable @typescript-eslint/no-explicit-any */
//import { toast } from "react-hot-toast";

import { QueryCache, QueryClient } from "@tanstack/react-query";

//import secureLocalStorage from "react-secure-storage";

//let unauthorizedNotificationShown = false; // Variável para controlar se a notificação já foi exibida

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: () => {
  /*     if (
        err.response.status === 401 &&
        err.request.responseURL.split("token/")[1] !== "validate" &&
        !unauthorizedNotificationShown // Verifica se a notificação já foi exibida
      ) {
       // secureLocalStorage.removeItem("token");
        sessionStorage.removeItem("token");
       // queryClient.refetchQueries(["validate"]);
       // toast.error("Token expirado");
        unauthorizedNotificationShown = true; // Marca que a notificação foi exibida
        setTimeout(() => {
          unauthorizedNotificationShown = false;
        }, 3000);
      } */
    },
  }),
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

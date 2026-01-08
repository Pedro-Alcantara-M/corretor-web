import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import { api } from "../api";
import type { Essay, EssayComment, EssaysResponse } from "./types";
import type { AxiosError } from "axios";

export const getByIdEssay = async (essayId: string) => {
  const response = await api.get(`/essays/${essayId}`);
  return response.data;
};

export const getEssays = async () => {
  const response = await api.get("/essays");
  return response.data;
};
export const addCommentToEssay = async (data: Partial<EssayComment>) => {
  const response = await api.post("/comments", data);
  return response.data;
};

export const updateEssay = async ({
  essayId,
  data,
}: {
  essayId: string;
  data: Partial<Essay>;
}): Promise<Essay> => {
  const response = await api.put(`/essays/${essayId}`, data);
  return response.data;
};

export const useGetByIdEssay = (
  essayId: string
): UseQueryResult<Essay, AxiosError> => {
  return useQuery<Essay, AxiosError>({
    queryKey: ["essay", essayId],
    queryFn: () => getByIdEssay(essayId),
    enabled: !!essayId,
  });
};

export const useAddCommentToEssay = () => {
  const queryClient = useQueryClient();

  return useMutation<EssayComment, AxiosError, Partial<EssayComment>>({
    mutationFn: addCommentToEssay,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["essay"] });
    },
  });
};

export const useUpdateEssay = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Essay,
    AxiosError,
    { essayId: string; data: Partial<Essay> }
  >({
    mutationFn: updateEssay,
    onSuccess: (_, { essayId }) => {
      queryClient.invalidateQueries({ queryKey: ["essay", essayId] });
    },
  });
};

export const useGetEssay = (): UseQueryResult<EssaysResponse, AxiosError> => {
  return useQuery<EssaysResponse, AxiosError>({
    queryKey: ["essays"],
    queryFn: () => getEssays(),
  });
};

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { api } from "../api";
import type { Essay, EssaysResponse } from "./types";
import type { AxiosError } from "axios";

export const getByIdEssay = async (essayId: string) => {
  const response = await api.get(`/essays/${essayId}`);
  return response.data;
};

export const getEssays = async () => {
  const response = await api.get("/essays");
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

export const useGetEssay = (): UseQueryResult<EssaysResponse, AxiosError> => {
  return useQuery<EssaysResponse, AxiosError>({
    queryKey: ["essays"],
    queryFn: () => getEssays(),
  });
};
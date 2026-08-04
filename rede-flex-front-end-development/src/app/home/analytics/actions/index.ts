'use server';
import { mongodb_client } from '@/database/connection';
import {
  apiRequestConfig,
  getAccessToken,
  microServiceRequestConfig,
} from '@/utils';
import { ObjectId } from 'mongodb';
import { AnaliseRede } from '../interfaces/analise_rede';

export async function fetchDashboardData(
  currentDate: string,
): Promise<AnaliseRede[]> {
  const response = await fetch(
    `${
      process.env.NEXT_MICROSERVICE_MONGODB
    }/calc-network-analysis/${getAccessToken()}?date=${currentDate}`,
    {
      headers: microServiceRequestConfig(),
      cache: 'no-cache',
    },
  );

  const json = await response.json();

  const { data }: { data: AnaliseRede[] } = json;

  return data;
}

export async function fetchTodayDashboardData(
  currentDate: string,
): Promise<AnaliseRede[]> {
  const response = await fetch(
    `${
      process.env.NEXT_MICROSERVICE_MONGODB
    }/calc-current-network-analysis/${getAccessToken()}?date=${currentDate}`,
    {
      headers: microServiceRequestConfig(),
      cache: 'no-cache',
    },
  );

  const json = await response.json();

  const { data }: { data: AnaliseRede[] } = json;

  return data;
}

export async function fetchMonthlyProjection(
  currentDate: string,
): Promise<AnaliseRede[]> {
  const response = await fetch(
    `${
      process.env.NEXT_MICROSERVICE_MONGODB
    }/calc-monthly-projection/${getAccessToken()}?date=${currentDate}`,
    {
      headers: microServiceRequestConfig(),
      cache: 'no-cache',
    },
  );

  const json = await response.json();

  const { data }: { data: AnaliseRede[] } = json;

  return data;
}

export async function fetchTodayMonthlyProjection(
  currentDate: string,
): Promise<AnaliseRede[]> {
  const response = await fetch(
    `${
      process.env.NEXT_MICROSERVICE_MONGODB
    }/calc-current-monthly-projection/${getAccessToken()}?date=${currentDate}`,
    {
      headers: microServiceRequestConfig(),
      cache: 'no-cache',
    },
  );

  const json = await response.json();

  const { data }: { data: AnaliseRede[] } = json;

  return data;
}

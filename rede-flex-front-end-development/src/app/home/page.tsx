'use client';
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Separator } from '@/components/ui/separator';
import { BarChart3Icon, BarChart4Icon } from 'lucide-react';
import { setDefaultOptions } from 'date-fns/setDefaultOptions';
import { ptBR as dateFnsPtBRLocale } from 'date-fns/locale/pt-BR';
import TrendingUp from './components/trendingUp';
import TrendingDown from './components/trendingDown';
import { formatNumber, numberToCurrency } from '@/lib/utils';
import { DateTime, Settings } from 'luxon';
import {
  fetchDashboardData,
  fetchMonthlyProjection,
  fetchTodayDashboardData,
  fetchTodayMonthlyProjection,
} from './analytics/actions';
import { clearInterval } from 'timers';
import { AnaliseRede } from './analytics/interfaces/analise_rede';

type UpdateData = {
  secondsToUpdate: number;
  isLoading: boolean;
  currentDate: DateTime | null;
};

export default function Dashboard() {
  setDefaultOptions({ locale: dateFnsPtBRLocale });
  Settings.defaultLocale = 'pt-BR';

  const combRef = useRef<any>(null);
  const prodRef = useRef<any>(null);

  const updateEach = 30;

  const timerRefAnaliseRede = useRef<NodeJS.Timeout | null>(null);
  const timerRefProjecaoMensal = useRef<NodeJS.Timeout | null>(null);

  const [updateDataAnaliseRede, setUpdateDataAnaliseRede] =
    useState<UpdateData>({
      secondsToUpdate: updateEach,
      isLoading: true,
      currentDate: null,
    });

  const [updateDataProjecaoMensal, setUpdateDataProjecaoMensal] =
    useState<UpdateData>({
      secondsToUpdate: updateEach,
      isLoading: true,
      currentDate: null,
    });

  const [analiseRedeHistorico, setAnaliseRedeHistorico] = useState<
    AnaliseRede[] | null
  >(null);
  const [analiseRedeHoje, setAnaliseRedeHoje] = useState<AnaliseRede[] | null>(
    null,
  );

  const [analiseRede, setAnaliseRede] = useState<
    {
      date: DateTime;
      galonagem: number;
      galonagemTotal: number;
      galonagemVariacao: number;
      produto: number;
      produtoTotal: number;
      produtoVariacao: number;
    }[]
  >([]);

  const [historicoProjecaoMensal, setHistoricoProjecaoMensal] = useState<
    AnaliseRede[] | null
  >([]);
  const [hojeProjecaoMensal, setHojeProjecaoMensal] = useState<
    AnaliseRede[] | null
  >([]);

  const [projecaoMensal, setProjecaoMensal] = useState<
    {
      date: DateTime;
      galonagem: number;
      galonagemTotal: number;
      galonagemProjecao: number;
      produto: number;
      produtoTotal: number;
      produtoProjecao: number;
    }[]
  >([]);

  async function updateDashboardData(isFirst: boolean) {
    try {
      setUpdateDataAnaliseRede((c) => ({ ...c, isLoading: true }));
      const newUpdateDate = DateTime.now();

      const response = fetchTodayDashboardData(newUpdateDate.toISO());

      if (isFirst || updateDataAnaliseRede.currentDate?.day != newUpdateDate.day) {
        const responseHistory = await fetchDashboardData(newUpdateDate.toISO());
        setAnaliseRedeHistorico(responseHistory);
      }

      setAnaliseRedeHoje(await response);

      setUpdateDataAnaliseRede((c) => ({ ...c, currentDate: newUpdateDate }));
    } catch (error) {
      console.error('error :>> ', error);
    } finally {
      setUpdateDataAnaliseRede((c) => ({ ...c, isLoading: false }));
    }
  }

  async function updateMonthlyProjection(isFirst: boolean) {
    try {
      setUpdateDataProjecaoMensal((c) => ({ ...c, isLoading: true }));
      const newUpdateDate = DateTime.now();

      const response = fetchTodayMonthlyProjection(newUpdateDate.toISO());

      if (isFirst || updateDataProjecaoMensal.currentDate?.day != newUpdateDate.day) {
        const responseHistory = await fetchMonthlyProjection(
          newUpdateDate.toISO(),
        );
        setHistoricoProjecaoMensal(responseHistory);
      }

      setHojeProjecaoMensal(await response);

      setUpdateDataProjecaoMensal((c) => ({
        ...c,
        currentDate: newUpdateDate,
      }));
    } catch (error) {
      console.error('error :>> ', error);
    } finally {
      setUpdateDataProjecaoMensal((c) => ({ ...c, isLoading: false }));
    }
  }

  const loopUpdate = useCallback(
    (
      secondsToUpdate: number,
      setUpdateData: Dispatch<SetStateAction<UpdateData>>,
      callback: (isFirst: boolean) => Promise<void>,
      timerRef: MutableRefObject<NodeJS.Timeout | null>,
    ) => {
      timerRef.current = setTimeout(async () => {
        const nextSeconds = secondsToUpdate - 1;

        if (nextSeconds <= 0) {
          await callback(false);

          setUpdateData((c) => ({ ...c, secondsToUpdate: updateEach }));
          loopUpdate(updateEach, setUpdateData, callback, timerRef);
        } else {
          setUpdateData((c) => ({ ...c, secondsToUpdate: nextSeconds }));
          loopUpdate(nextSeconds, setUpdateData, callback, timerRef);
        }
      }, 1000);
    },
    [updateEach],
  );

  useEffect(() => {
    updateDashboardData(true).then(() =>
      loopUpdate(
        updateDataAnaliseRede.secondsToUpdate,
        setUpdateDataAnaliseRede,
        updateDashboardData,
        timerRefAnaliseRede,
      ),
    );

    updateMonthlyProjection(true).then(() =>
      loopUpdate(
        updateDataProjecaoMensal.secondsToUpdate,
        setUpdateDataProjecaoMensal,
        updateMonthlyProjection,
        timerRefAnaliseRede,
      ),
    );

    return () => {
      if (timerRefAnaliseRede.current)
        clearTimeout(timerRefAnaliseRede.current);
      if (timerRefProjecaoMensal.current)
        clearTimeout(timerRefProjecaoMensal.current);
    };
  }, []);

  useEffect(() => {
    if (analiseRedeHistorico && analiseRedeHoje) {
      const analise = [...analiseRedeHistorico, ...analiseRedeHoje];
      const dates = analise
        .map(({ date }) => date)
        .filter((item, index, src) => src.indexOf(item) == index)
        .toSorted();

      const analiseRedeHistoricoIndexed: any = analiseRedeHistorico.reduce(
        (acc, item) => ({ ...acc, [item.date]: item }),
        {},
      );
      const analiseRedeHojeIndexed: any = analiseRedeHoje.reduce(
        (acc, item) => ({ ...acc, [item.date]: item }),
        {},
      );

      setAnaliseRede(
        dates.map((date, index, source) => {
          const variacao = {
            galonagemVariacao: 0,
            produtoVariacao: 0,
          };

          const historico = analiseRedeHistoricoIndexed[date];

          const atual = analiseRedeHojeIndexed[date];

          if (index != 0) {
            const datePrevious = source[index - 1];
            const anterior = analiseRedeHojeIndexed[datePrevious];

            const qtdGalonagemPrev = anterior.qtdGalonagem,
              qtdGalonagemCur = atual.qtdGalonagem;

            variacao.galonagemVariacao =
              (qtdGalonagemCur / qtdGalonagemPrev - 1) * 100;

            const valorTotalProdutosPrev = anterior.valorTotalProdutos,
              valorTotalProdutosCur = atual.valorTotalProdutos;

            variacao.produtoVariacao =
              (valorTotalProdutosCur / valorTotalProdutosPrev - 1) * 100;
          }

          return {
            date: DateTime.fromISO(date),

            galonagem: atual.qtdGalonagem,
            galonagemTotal: (index === source.length - 1 ? atual : historico)
              .qtdGalonagem,
            galonagemVariacao: variacao.galonagemVariacao,

            produto: atual.valorTotalProdutos,
            produtoTotal: (index === source.length - 1 ? atual : historico)
              .valorTotalProdutos,
            produtoVariacao: variacao.produtoVariacao,
          };
        }),
      );
    }
  }, [analiseRedeHistorico, analiseRedeHoje]);

  useEffect(() => {
    const newUpdateDate = updateDataProjecaoMensal.currentDate;

    if (historicoProjecaoMensal && hojeProjecaoMensal && newUpdateDate) {
      const minutesToday =
        newUpdateDate.diff(newUpdateDate.startOf('day'), 'minutes').minutes /
        1440;

      const analise = [...historicoProjecaoMensal, ...hojeProjecaoMensal];

      const dates = analise
        .map(({ date }) => date)
        .filter((item, index, src) => src.indexOf(item) == index)
        .toSorted();

      const hojeProjecaoMensalIndexed: any = hojeProjecaoMensal.reduce(
        (acc, item) => ({ ...acc, [item.date]: item }),
        {},
      );

      setProjecaoMensal(
        dates.map((date, index) => {
          const dateTime = DateTime.fromISO(date);
          const sub = historicoProjecaoMensal.slice(0, index + 1);

          const somaGalonagem = sub.reduce(
            (acc, item) => acc + item.qtdGalonagem,
            0,
          );
          const somaProduto = sub.reduce(
            (acc, item) => acc + item.valorTotalProdutos,
            0,
          );

          const hoje = hojeProjecaoMensal.find((p) => p.date === date);

          const timeToday =
            dateTime.day +
            (dateTime.toISODate() == newUpdateDate.toISODate()
              ? minutesToday - 1
              : 0);

          return {
            date: dateTime,

            galonagem: hoje?.qtdGalonagem,
            galonagemTotal: somaGalonagem,
            galonagemProjecao: dateTime.daysInMonth
              ? (somaGalonagem / timeToday) * dateTime.daysInMonth
              : 0,

            produto: hoje?.valorTotalProdutos,
            produtoTotal: somaProduto,
            produtoProjecao: dateTime.daysInMonth
              ? (somaProduto / timeToday) * dateTime.daysInMonth
              : 0,
          };
        }) as any,
      );
    }
  }, [updateDataProjecaoMensal.currentDate]);

  return (
    <>
      <div className='flex lg:flex-row md:flex-row sm:flex-col flex-col justify-between lg:items-end md:items-end sm:items-center items-center w-full'>
        <div className='flex lg:flex-row md:flex-row sm:flex-row flex-col lg:items-end md:items-end sm:items-end items-center gap-1'>
          <div className='text-xs font-semibold text-muted-foreground uppercase tracking-wide pb-2'></div>
        </div>
      </div>
      <div className='flex flex-col gap-6 h-auto w-full pr-1'>
        <div className='flex flex-col gap-12 h-full w-full'>
          <div className='flex w-full flex-col gap-12'>
            <div className='flex flex-col items-center gap-2 w-full'>
              <div className='rounded-lg rounded-tr-xl border text-card-foreground shadow-sm w-full'>
                <div className='flex flex-col p-6 bg-secondary text-white rounded-t-lg rounded-tr-xl relative'>
                  <div className='flex items-center gap-2'>
                    <BarChart3Icon />
                    <h3 className='font-semibold tracking-tight text-lg'>
                      Análise da Rede
                    </h3>
                  </div>
                  <p className='text-white/80 text-sm'>
                    Dia da semana:{' '}
                    <span className='capitalize font-bold'>
                      {updateDataAnaliseRede.currentDate
                        ? updateDataAnaliseRede.currentDate.toFormat('cccc')
                        : '--'}
                    </span>{' '}
                    -{' '}
                    {updateDataAnaliseRede.currentDate
                      ? updateDataAnaliseRede.currentDate.toFormat('dd/MM')
                      : '--'}
                  </p>

                  <div className='absolute top-0 right-0'>
                    <div className='flex justify-center items-center px-1 py-2 rounded-0 rounded-bl-lg rounded-tr-lg border-[1px] border-2 gap-1 bg-white text-black'>
                      <p className='text-xs font-bold'>
                        {updateDataAnaliseRede.currentDate
                          ? updateDataAnaliseRede.currentDate.toFormat(
                              'dd/MM/yyyy HH:mm',
                            )
                          : '--'}
                      </p>
                      <div>|</div>
                      <span
                        className='text-xs text-center'
                        style={{ width: '20px' }}
                      >
                        {updateDataAnaliseRede.isLoading ? (
                          <div className='inline-block h-3 w-3 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] text-main-color' />
                        ) : (
                          updateDataAnaliseRede.secondsToUpdate
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className='p-4'>
                  <div className='space-y-2'>
                    <div className='grid grid-cols-3 grid-rows-2 md:grid-cols-5 md:grid-rows-1 gap-2 py-3 border-b border-border/50 last:border-b-0 font-semibold bg-muted/50 rounded-lg px-3'>
                      <div className='text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
                        Dia
                      </div>
                      <div className='text-xs font-semibold text-muted-foreground uppercase tracking-wide text-center'>
                        Galonagem (L)
                      </div>
                      <div className='text-xs font-semibold text-muted-foreground uppercase tracking-wide text-center hidden md:block'>
                        Variação
                      </div>
                      <div className='text-xs font-semibold text-muted-foreground uppercase tracking-wide text-center'>
                        Produto (R$)
                      </div>
                      <div className='text-xs font-semibold text-muted-foreground uppercase tracking-wide text-center hidden md:block'>
                        Variação
                      </div>
                    </div>
                    {analiseRede.map((dados, index) => (
                      <div
                        key={'analise_rede' + dados.date.toISODate()}
                        className='grid grid-cols-3 grid-rows-2 md:grid-cols-5 md:grid-rows-1 gap-2 py-3 border-b last:border-b-0 hover:bg-gray-100 last:bg-gray-200 px-3 rounded-lg'
                      >
                        <div className='text-sm font-semibold row-span-2 md:row-span-1 order-1'>
                          {dados.date.toFormat('dd/MM')}
                        </div>
                        <div className='text-sm text-center font-mono order-2 md:order-2'>
                          <span className='block font-bold'>
                            {formatNumber(dados.galonagem, {
                              maximumFractionDigits: 0,
                            })}
                          </span>
                          <span className='block'>
                            {formatNumber(dados.galonagemTotal, {
                              maximumFractionDigits: 0,
                            })}
                          </span>
                        </div>
                        <div className='text-sm text-center order-4 md:order-3'>
                          {index == 0 ? (
                            <span className='text-xs'>N/A</span>
                          ) : dados.galonagemVariacao > 0 ? (
                            <TrendingUp value={dados.galonagemVariacao} />
                          ) : (
                            <TrendingDown value={dados.galonagemVariacao} />
                          )}
                        </div>
                        <div className='text-sm text-center font-mono order-3 md:order-4'>
                          <span className='block font-bold'>
                            {numberToCurrency(dados.produto, {
                              maximumFractionDigits: 0,
                            })}
                          </span>
                          <span className='block'>
                            {numberToCurrency(dados.produtoTotal, {
                              maximumFractionDigits: 0,
                            })}
                          </span>
                        </div>
                        <div className='text-sm text-center order-5 md:order-5'>
                          {index == 0 ? (
                            <span className='text-xs'>N/A</span>
                          ) : dados.produtoVariacao > 0 ? (
                            <TrendingUp value={dados.produtoVariacao} />
                          ) : (
                            <TrendingDown value={dados.produtoVariacao} />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className='rounded-lg border text-card-foreground shadow-sm w-full'>
                <div className='flex flex-col p-6 bg-secondary text-white rounded-t-lg rounded-tr-xl relative'>
                  <div className='flex items-center gap-2'>
                    <BarChart4Icon />
                    <h3 className='font-semibold tracking-tight text-lg'>
                      Projeção Mensal
                    </h3>
                  </div>
                  <p className='text-white/80 text-sm'>
                    Dia da semana:{' '}
                    <span className='capitalize font-bold'>
                      {updateDataProjecaoMensal.currentDate
                        ? updateDataProjecaoMensal.currentDate.toFormat('cccc')
                        : '--'}
                    </span>{' '}
                    -{' '}
                    {updateDataProjecaoMensal.currentDate
                      ? updateDataProjecaoMensal.currentDate.toFormat('dd/MM')
                      : '--'}
                  </p>

                  <div className='absolute top-0 right-0'>
                    <div className='flex justify-center items-center px-1 py-2 rounded-0 rounded-bl-lg rounded-tr-lg border-[1px] border-2 gap-1 bg-white text-black'>
                      <p className='text-xs font-bold'>
                        {updateDataProjecaoMensal.currentDate
                          ? updateDataProjecaoMensal.currentDate.toFormat(
                              'dd/MM/yyyy HH:mm',
                            )
                          : '--'}
                      </p>
                      <div>|</div>
                      <span
                        className='text-xs text-center'
                        style={{ width: '20px' }}
                      >
                        {updateDataProjecaoMensal.isLoading ? (
                          <div className='inline-block h-3 w-3 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] text-main-color' />
                        ) : (
                          updateDataProjecaoMensal.secondsToUpdate
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className='p-4'>
                  <div className='space-y-2'>
                    <div className='grid grid-cols-3 grid-rows-2 md:grid-cols-5 md:grid-rows-1 gap-2 py-3 border-b border-border/50 last:border-b-0 font-semibold bg-muted/50 rounded-lg px-3'>
                      <div className='text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
                        Dia
                      </div>
                      <div className='text-xs font-semibold text-muted-foreground uppercase tracking-wide text-center'>
                        Galonagem (L)
                      </div>
                      <div className='text-xs font-semibold text-muted-foreground uppercase tracking-wide text-center hidden md:block'>
                        Projeção
                      </div>
                      <div className='text-xs font-semibold text-muted-foreground uppercase tracking-wide text-center'>
                        Produto (R$)
                      </div>
                      <div className='text-xs font-semibold text-muted-foreground uppercase tracking-wide text-center hidden md:block'>
                        Projeção
                      </div>
                    </div>
                    {projecaoMensal.map((dados, index) => (
                      <div
                        key={'analise_rede' + dados.date.toISODate()}
                        className={`grid grid-cols-3 grid-rows-2 md:grid-cols-5 md:grid-rows-1 gap-2 py-3 border-b last:border-b-0 hover:bg-gray-100 px-3 rounded-lg ${
                          dados.date.weekday ==
                          updateDataProjecaoMensal.currentDate?.weekday
                            ? 'bg-gray-200'
                            : ''
                        }`}
                      >
                        <div className='text-sm font-semibold row-span-2 md:row-span-1 order-1'>
                          {dados.date.toFormat('dd/MM')}
                        </div>
                        <div className='text-sm text-center font-mono order-2 md:order-2'>
                          <span className='block font-bold'>
                            {formatNumber(dados.galonagem, {
                              maximumFractionDigits: 0,
                            })}
                          </span>
                          <span className='block'>
                            {formatNumber(dados.galonagemTotal, {
                              maximumFractionDigits: 0,
                            })}
                          </span>
                        </div>
                        <div className='text-sm text-center order-4 md:order-3'>
                          {formatNumber(dados.galonagemProjecao, {
                            maximumFractionDigits: 0,
                          })}
                        </div>
                        <div className='text-sm text-center font-mono order-3 md:order-4'>
                          <span className='block font-bold'>
                            {numberToCurrency(dados.produto, {
                              maximumFractionDigits: 0,
                            })}
                          </span>
                          <span className='block'>
                            {numberToCurrency(dados.produtoTotal, {
                              maximumFractionDigits: 0,
                            })}
                          </span>
                        </div>
                        <div className='text-sm text-center order-5 md:order-5'>
                          {numberToCurrency(dados.produtoProjecao, {
                            maximumFractionDigits: 0,
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Separator />
        </div>
      </div>
    </>
  );
}

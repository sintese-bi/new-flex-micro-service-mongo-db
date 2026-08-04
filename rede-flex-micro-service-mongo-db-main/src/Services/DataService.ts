import { PrismaClient as PrismaLBCBi } from '../../generated/clientLBCBi';
import { PrismaClient as PrismaSales } from '../../generated/clientSales';
import { PrismaClient as PrismaRedeFlex } from '../../generated/clientRedeFlex';
import { PrismaClient as PrismaGasMonitor } from '../../generated/clientGasMonitor';
import { DateTime } from 'luxon';

const prismaLBCBi = new PrismaLBCBi();
const prismaSales = new PrismaSales();
const prismaRedeFlex = new PrismaRedeFlex();
const prismaGasMonitor = new PrismaGasMonitor();

export async function calcFuelByDates(
  dates: DateTime[],
  toEndOfDay: boolean,
): Promise<{ [date: string]: number }> {
  const result = await prismaGasMonitor.abastecimentos.aggregateRaw({
    pipeline: [
      {
        $match: {
          ori: { $in: ['0', '1'] },
          $or: dates.map((originalDate) => {
            // O deslocamento de 3 horas corrige o fuso horário incorreto que é salvo no banco de dados
            const date = originalDate.minus({ hours: 3 }).toUTC();

            const start = date.startOf('day').toISO();
            const end = toEndOfDay ? date.endOf('day').toISO() : date.toISO();

            return {
              dtHr: {
                $gte: { $date: start },
                $lte: { $date: end },
              },
            };
          }),
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$dtHr',
              timezone: '-00:00',
            },
          },
          totalVol: {
            $sum: '$vol',
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ],
  });

  return (result as any).reduce(
    (acc: any, item: any) => ({ ...acc, [item._id]: item.totalVol }),
    {},
  );
}

export async function calcProductByDates(
  dates: DateTime[],
  toEndOfDay: boolean,
): Promise<{ [date: string]: number }> {
  const result = await prismaSales.vendas.aggregateRaw({
    pipeline: [
      {
        $unwind: '$items',
      },
      {
        $match: {
          $or: dates.map((originalDate) => {
            // O deslocamento de 3 horas corrige o fuso horário incorreto que é salvo no banco de dados
            const date = originalDate.minus({ hours: 3 }).toUTC();

            const start = date.startOf('day').toISO();
            const end = toEndOfDay ? date.endOf('day').toISO() : date.toISO();

            return {
              dtHr: {
                $gte: { $date: start },
                $lte: { $date: end },
              },
            };
          }),
          'items.iTip': {
            $eq: '0',
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$dtHr',
              timezone: '-00:00',
            },
          },
          total: {
            $sum: {
              $toDouble: '$items.tot',
            },
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ],
  });

  return (result as any).reduce(
    (acc: any, item: any) => ({ ...acc, [item._id]: item.total }),
    {},
  );
}

export async function getVolumePorPosto(
  dates: DateTime[],
  toEndOfDay: boolean,
): Promise<{ [date: string]: number }> {
  const result = await prismaGasMonitor.abastecimentos.aggregateRaw({
    pipeline: [
      {
        $match: {
          ori: { $in: ['0', '1'] },
          $or: dates.map((originalDate) => {
            // O deslocamento de 3 horas corrige o fuso horário incorreto que é salvo no banco de dados
            const date = originalDate.minus({ hours: 3 }).toUTC();

            const start = date.startOf('day').toISO();
            const end = toEndOfDay ? date.endOf('day').toISO() : date.toISO();

            return {
              dtHr: {
                $gte: { $date: start },
                $lte: { $date: end },
              },
            };
          }),
        },
      },
      {
          $group: {
  _id: {
    data: {
      $dateToString: {
        format: '%Y-%m-%d',
        date: '$dtHr',
        timezone: '-00:00',
      },
    },
    ibm: '$ibm'
  },
  totalVol: { // ou 'total' na segunda função
    $sum: '$vol',
  },
},
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ],
  });

 return (result as any).reduce(
  (acc: any, item: any) => ({ ...acc, [`${item._id.ibm}_${item._id.data}`]: item.totalVol }),
  {},
);
}

export async function getItensTotaisPorPosto(
  dates: DateTime[],
  toEndOfDay: boolean,
): Promise<{ [date: string]: number }> {
  const result = await prismaSales.vendas.aggregateRaw({
    pipeline: [
      {
        $unwind: '$items',
      },
      {
        $match: {
          $or: dates.map((originalDate) => {
            // O deslocamento de 3 horas corrige o fuso horário incorreto que é salvo no banco de dados
            const date = originalDate.minus({ hours: 3 }).toUTC();

            const start = date.startOf('day').toISO();
            const end = toEndOfDay ? date.endOf('day').toISO() : date.toISO();

            return {
              dtHr: {
                $gte: { $date: start },
                $lte: { $date: end },
              },
            };
          }),
          'items.iTip': {
            $eq: '0',
          },
        },
      },
      {
        $group: {
          _id: {
            data: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$dtHr',
                timezone: '-00:00',
              },
            },
            ibm: '$ibm'
          },
          total: { 
            $sum: {
              $toDouble: '$items.tot',
            },
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ],
  });

  return (result as any).reduce(
    (acc: any, item: any) => ({ ...acc, [`${item._id.ibm}_${item._id.data}`]: item.total }),
    {},
  );
}

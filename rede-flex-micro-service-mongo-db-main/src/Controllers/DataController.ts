import "moment-timezone";
import { Request, Response } from "express";
import { PrismaClient as PrismaLBCBi } from "../../generated/clientLBCBi";
import { PrismaClient as PrismaSales } from "../../generated/clientSales";
import { PrismaClient as PrismaRedeFlex } from "../../generated/clientRedeFlex";
import moment from "moment";
import extractUserIdFromToken from "../utils/extractUserID";
import axios from "axios";
import cron from "node-cron";
import { DateTime } from 'luxon';
const prismaLBCBi = new PrismaLBCBi();
const prismaSales = new PrismaSales();
const prismaRedeFlex = new PrismaRedeFlex();
import regionStation from "../utils/regionsstation.json";
import { calcFuelByDates, calcProductByDates } from "../Services/DataService";
// import regionstation from "../utils/region";
class DataController {
  //Listagem dos nomes de tipos de combustível e produtos
  public async infoData(req: Request, res: Response) {
    try {
      const clientToken = req.headers.authorization;
      if (!clientToken) {
        return res.status(401).json({ message: "Token não fornecido." });
      }
      const expectedToken = process.env.TOKEN;
      if (clientToken == `Bearer ${expectedToken}`) {
        const fuel = await prismaLBCBi.combustiveis.findMany({
          where: { del: "F" },
        });

        const products = await prismaLBCBi.produtos.findMany();

        const fuelNames = fuel.map((element) => {
          return element.des;
        });

        const productsNames = products.map((element) => {
          return element.des;
        });
        const uniqueFuelNames = [...new Set(fuelNames)];
        const uniqueProductNames = [...new Set(productsNames)];

        return res.status(200).json({
          data: {
            fuelMargin: uniqueFuelNames,
            productMargin: uniqueProductNames,
          },
        });
      } else {
        return res
          .status(401)
          .json({ message: "Falha na autenticação: Token inválido." });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: `Erro ao retornar os dados: ${error}` });
    }
  }
  //Big numbers de valores de gasolina e produto
  public async sumFuelLiterage(req: Request, res: Response) {
    try {
      const actualdate = moment().tz("America/Sao_Paulo").format("YYYY-MM-DD");
      const firstDayOfMonth = moment()
        .tz("America/Sao_Paulo")
        .startOf("month")
        .format("YYYY-MM-DD");
      const clientToken = req.headers.authorization;
      const { use_token }: any = req.params;
      const actualDay = parseFloat(actualdate.split("-")[2]) - 1;

      if (!clientToken) {
        return res.status(401).json({ message: "Token não fornecido." });
      }
      const expectedToken = process.env.TOKEN;
      if (clientToken == `Bearer ${expectedToken}`) {
        const fuelliterageSell = await prismaSales.vendas.findMany({
          select: {
            items: {
              select: {
                iTip: true,
                tot: true,
                qd: true,
                pC: true,
              },
            },
            ibm: true,
          },
          where: {
            dtHr: {
              gte: `${actualdate}T00:00:00.000-03:00`,
              lte: `${actualdate}T23:59:59.999-03:00`,
            },
          },
        });
        //Construção array de items
        const itemsArray = fuelliterageSell.flatMap((element) => {
          return element.items;
        });

        //Quantas vezes foi abastecido combustível nos postos
        const supplyQuantity = itemsArray.flatMap((element) => {
          return element;
        });
        //Quantas vezes entraram carros e compraram no posto
        const quantTotal = itemsArray.length;
        const quantSupply = supplyQuantity.length;

        //Soma combustíveis tipo combustivel
        const fuel = itemsArray
          .map((element) => {
            if (element.iTip == "1") {
              return parseFloat(element.tot);
            }
            return undefined;
          })
          .filter((item): item is number => item !== undefined);

        const sumFuel = fuel.reduce((accumulator, currentValue) => {
          return (accumulator || 0) + (currentValue || 0);
        }, 0);

        //Faturamento total combustível+produto
        const fuelTotal = itemsArray
          .map((element) => {
            return parseFloat(element.tot);
          })
          .filter((item): item is number => item !== undefined);

        const sumFuelTotal = fuelTotal.reduce((accumulator, currentValue) => {
          return (accumulator || 0) + (currentValue || 0);
        }, 0);

        //Soma da litragem tipo combustível
        const literage = itemsArray
          .map((element) => {
            if (element.iTip == "1") {
              return parseFloat(element.qd);
            }
            return undefined;
          })
          .filter((item): item is number => item !== undefined);

        //Carros que entraram no posto
        const supply = itemsArray.map((element) => {
          return parseFloat(element.qd);
        }, 0);
        const sumSupply = supply.reduce((accumulator, currentValue) => {
          return (accumulator || 0) + (currentValue || 0);
        }, 0);
        const sumLiterage = literage.reduce((accumulator, currentValue) => {
          return (accumulator || 0) + (currentValue || 0);
        }, 0);
        //Soma do preço de custo do combustível
        const cost_price = itemsArray
          .map((element) => {
            if (element.iTip === "1") {
              return { pc: parseFloat(element.pC), qd: parseFloat(element.qd) };
            }
            return undefined;
          })
          .filter(
            (item): item is { pc: number; qd: number } => item !== undefined
          );

        const sumCostPrice = cost_price.reduce((accumulator, currentValue) => {
          return (accumulator || 0) + (currentValue.qd * currentValue.pc || 0);
        }, 0);

        //Soma combustíveis tipo produto
        const fuelProd = itemsArray
          .map((element) => {
            if (element.iTip == "0") {
              return parseFloat(element.tot);
            }
            return undefined;
          })
          .filter((item): item is number => item !== undefined);

        const sumFuelProd = fuelProd.reduce((accumulator, currentValue) => {
          return (accumulator || 0) + (currentValue || 0);
        }, 0);

        //Soma da litragem tipo produto
        const literageProd = itemsArray
          .map((element) => {
            if (element.iTip == "0") {
              return parseFloat(element.qd);
            }
            return undefined;
          })
          .filter((item): item is number => item !== undefined);

        const sumLiterageProd = literageProd.reduce(
          (accumulator, currentValue) => {
            return (accumulator || 0) + (currentValue || 0);
          },
          0
        );
        //Soma do preço de custo do produto
        const product_price = itemsArray
          .map((element) => {
            if (element.iTip === "0") {
              return { pc: parseFloat(element.pC), qd: parseFloat(element.qd) };
            }
            return undefined;
          })
          .filter(
            (item): item is { pc: number; qd: number } => item !== undefined
          );

        const sumProductPrice = product_price.reduce(
          (accumulator, currentValue) => {
            return (
              (accumulator || 0) + (currentValue.pc * currentValue.qd || 0)
            );
          },
          0
        );

        //Fluxo valor bignumbers ultima semana
        const samedayLastWeek = moment()
          .tz("America/Sao_Paulo")
          .subtract(7, "days")
          .format("YYYY-MM-DD");
        const samedayLastWeekDate = moment()
          .tz("America/Sao_Paulo")
          .subtract(7, "days")
          .subtract(3, "hours")
          .toISOString();

        const fuelliterageSellLastWeek = await prismaSales.vendas.findMany({
          select: {
            items: {
              select: {
                iTip: true,
                tot: true,
                qd: true,
                pC: true,
              },
            },
            ibm: true,
            dtHr: true,
          },
          where: {
            dtHr: {
              gte: `${samedayLastWeek}T00:00:00.000Z`,
              lte: samedayLastWeekDate,
            },
          },
        });
        //Construção array de items
        const itemsArrayLastWeek = fuelliterageSellLastWeek.flatMap(
          (element) => {
            return element.items;
          }
        );

        //Quantas vezes foi abastecido combustível nos postos
        const supplyQuantityLastWeek = itemsArrayLastWeek.flatMap((element) => {
          return element;
        });
        //Quantas vezes entraram carros e compraram no posto
        const quantTotalLastWeek = itemsArrayLastWeek.length;
        const quantSupplyLastWeek = supplyQuantityLastWeek.length;

        //Soma combustíveis tipo combustivel
        const fuelLastWeek = itemsArrayLastWeek
          .map((element) => {
            if (element.iTip == "1") {
              return parseFloat(element.tot);
            }
            return undefined;
          })
          .filter((item): item is number => item !== undefined);

        const sumFuelLastWeek = fuelLastWeek.reduce(
          (accumulator, currentValue) => {
            return (accumulator || 0) + (currentValue || 0);
          },
          0
        );

        //Faturamento total combustível+produto
        const fuelTotalLastWeek = itemsArrayLastWeek
          .map((element) => {
            return parseFloat(element.tot);
          })
          .filter((item): item is number => item !== undefined);

        const sumFuelTotalLastWeek = fuelTotalLastWeek.reduce(
          (accumulator, currentValue) => {
            return (accumulator || 0) + (currentValue || 0);
          },
          0
        );

        //Soma da litragem tipo combustível
        const literageLastWeek = itemsArrayLastWeek
          .map((element) => {
            if (element.iTip == "1") {
              return parseFloat(element.qd);
            }
            return undefined;
          })
          .filter((item): item is number => item !== undefined);

        //Carros que entraram no posto
        const supplyLastWeek = itemsArrayLastWeek.map((element) => {
          return parseFloat(element.qd);
        }, 0);
        const sumSupplyLastWeek = supplyLastWeek.reduce(
          (accumulator, currentValue) => {
            return (accumulator || 0) + (currentValue || 0);
          },
          0
        );
        const sumLiterageLastWeek = literageLastWeek.reduce(
          (accumulator, currentValue) => {
            return (accumulator || 0) + (currentValue || 0);
          },
          0
        );
        //Soma do preço de custo do combustível
        const cost_priceLastWeek = itemsArrayLastWeek
          .map((element) => {
            if (element.iTip === "1") {
              return { pc: parseFloat(element.pC), qd: parseFloat(element.qd) };
            }
            return undefined;
          })
          .filter(
            (item): item is { pc: number; qd: number } => item !== undefined
          );

        const sumCostPriceLastWeek = cost_priceLastWeek.reduce(
          (accumulator, currentValue) => {
            return (
              (accumulator || 0) + (currentValue.qd * currentValue.pc || 0)
            );
          },
          0
        );

        //Soma combustíveis tipo produto
        const fuelProdLastWeek = itemsArrayLastWeek
          .map((element) => {
            if (element.iTip == "0") {
              return parseFloat(element.tot);
            }
            return undefined;
          })
          .filter((item): item is number => item !== undefined);

        const sumFuelProdLastWeek = fuelProdLastWeek.reduce(
          (accumulator, currentValue) => {
            return (accumulator || 0) + (currentValue || 0);
          },
          0
        );

        //Soma da litragem tipo produto
        const literageProdLastWeek = itemsArrayLastWeek
          .map((element) => {
            if (element.iTip == "0") {
              return parseFloat(element.qd);
            }
            return undefined;
          })
          .filter((item): item is number => item !== undefined);

        const sumLiterageProdLastWeek = literageProdLastWeek.reduce(
          (accumulator, currentValue) => {
            return (accumulator || 0) + (currentValue || 0);
          },
          0
        );
        //Soma do preço de custo do produto
        const product_priceLastWeek = itemsArrayLastWeek
          .map((element) => {
            if (element.iTip === "0") {
              return { pc: parseFloat(element.pC), qd: parseFloat(element.qd) };
            }
            return undefined;
          })
          .filter(
            (item): item is { pc: number; qd: number } => item !== undefined
          );

        const sumProductPriceLastWeek = product_priceLastWeek.reduce(
          (accumulator, currentValue) => {
            return (
              (accumulator || 0) + (currentValue.pc * currentValue.qd || 0)
            );
          },
          0
        );

        //Diferença faturamento de combustível pelo custo que é o lucro
        const fuelProfit =
          Math.round((sumFuel - sumCostPrice - sumLiterage * 0.04) * 100) / 100;
        //Diferença faturamento de produto pelo custo que é o lucro
        const productProfit =
          Math.round((sumFuelProd - sumProductPrice) * 100) / 100;
        // Exemplo de verificação antes da divisão:
        const secondary_value_fuel =
          quantSupply !== 0 ? sumFuelTotal / quantSupply : 0;
        const secondary_value_galonagem =
          quantSupply !== 0 ? sumLiterage / quantSupply : 0;
        const secondary_value_tmc =
          quantSupply !== 0 ? sumFuel / quantSupply : 0;
        const secondary_value_produto =
          quantSupply !== 0 ? sumFuelProd / quantSupply : 0;
        const secondary_value_fuelProfit =
          sumFuel !== 0 ? (fuelProfit / sumFuel) * 100 : 0;
        const secondary_value_productProfit =
          sumFuelProd !== 0 ? (productProfit / sumFuelProd) * 100 : 0;

        const secondary_value_bruto_operacional =
          sumFuelTotal !== 0
            ? ((productProfit + fuelProfit) / sumFuelTotal) * 100
            : 0;
        const valueMLT = sumLiterage !== 0 ? fuelProfit / sumLiterage : 0;
        //Fluxo para comparação flags
        const secret = process.env.SECRET;
        if (!secret) {
          throw new Error(
            "Chave secreta não definida. Verifique a variável de ambiente SECRET."
          );
        }
        const id = extractUserIdFromToken(use_token, secret);
        const flags = await prismaRedeFlex.users.findUnique({
          select: {
            use_tmc: true,
            use_mlt: true,
            use_tmf: true,
            use_tmp: true,
            use_tmvol: true,
            use_lucro_bruto_operacional_galonagem: true,
            use_lucro_bruto_operacional_produto: true,
            use_lucro_bruto_operacional: true,
          },
          where: { use_uuid: id },
        });
        const tmc = (flags?.use_tmc ?? 0) <= secondary_value_tmc;
        const mlt = (flags?.use_mlt ?? 0) <= Math.round(valueMLT * 100) / 100;
        const use_tmf = (flags?.use_tmf ?? 0) <= secondary_value_fuel;
        const use_tmp = (flags?.use_tmp ?? 0) <= secondary_value_produto;
        const use_tmvol = (flags?.use_tmp ?? 0) <= secondary_value_galonagem;
        const lucro_operacional_galonagem =
          (flags?.use_lucro_bruto_operacional_galonagem ?? 0) <=
          secondary_value_fuelProfit;
        const lucro_operacional_produto =
          (flags?.use_lucro_bruto_operacional_produto ?? 0) <=
          secondary_value_productProfit;
        const lucro_operacional_geral =
          (flags?.use_lucro_bruto_operacional ?? 0) * 100 <=
          Math.round(secondary_value_bruto_operacional * 100) / 100;
        const monthBigNumbers =
          await prismaRedeFlex.big_numbers_values.findFirst({
            select: {
              bignumbers_fuelProfit: true,
              bignumbers_fuelSales: true,
              bignumbers_invoicing: true,
              bignumbers_productProfit: true,
              bignumbers_productSales: true,
              bignumbers_sumliterage: true,
              bignumbers_Supplies: true,
              bignumbers_dailyProductProfit: true,
              bignumbers_dailyLiterageProfit: true,
            },
            where: { bignumbers_uuid: "650f5af0-b341-4980-aad0-8617e53c41ec" },
          });
        //Produção: 650f5af0-b341-4980-aad0-8617e53c41ec
        //Desenvolvimento:0e10f272-8a0e-43f2-a1d3-fcebd68dd59e
        //Fluxo comparação média mensal
        const galonagemLitrosCondição =
          Math.round(sumLiterage * 100) / 100 >=
          Math.round(
            ((monthBigNumbers?.bignumbers_sumliterage ?? 0) / actualDay) * 100
          ) /
          100;
        const faturamentoRedeCondição =
          Math.round(sumFuelTotal * 100) / 100 >=
          Math.round(
            ((monthBigNumbers?.bignumbers_invoicing ?? 0) / actualDay) * 100
          ) /
          100;
        const abastecimentoRedeCondição =
          Math.round(quantSupply * 100) / 100 >=
          Math.round(
            ((monthBigNumbers?.bignumbers_Supplies ?? 0) / actualDay) * 100
          ) /
          100;
        const vendaCombustíveisCondição =
          Math.round(sumFuel * 100) / 100 >=
          Math.round(
            ((monthBigNumbers?.bignumbers_fuelSales ?? 0) / actualDay) * 100
          ) /
          100;
        const lucroCombustíveisCondição =
          fuelProfit >=
          Math.round(
            ((monthBigNumbers?.bignumbers_fuelProfit ?? 0) / actualDay) * 100
          ) /
          100;
        const vendaProdutosCondição =
          Math.round(sumFuelProd * 100) / 100 >=
          Math.round(
            ((monthBigNumbers?.bignumbers_productSales ?? 0) / actualDay) * 100
          ) /
          100;
        const lucroProdutosCondição =
          (monthBigNumbers?.bignumbers_dailyProductProfit ?? 0) >=
          Math.round(
            ((monthBigNumbers?.bignumbers_productProfit ?? 0) / actualDay) * 100
          ) /
          100;

        const actualdateLastWeek =
          moment().tz("America/Sao_Paulo").subtract(7, "days")
            .format("YYYY-MM-DDTHH:mm:ss") + "Z";
        const startOfDay = new Date(actualdateLastWeek);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(actualdateLastWeek);
        endOfDay.setHours(23, 59, 59, 999);
        //Fluxo última semana Resultado bruto galonagem e produto
        const grossLiterageLastWeek = await prismaRedeFlex.gallon_gross_last_week.findFirst({
          select: { gallon_last_history_gross: true, gallon_last_history_date: true },
          where: { gallon_last_history_date: { gt: actualdateLastWeek }, use_uuid: id },
          orderBy: { gallon_last_history_date: 'asc' }
        })

        const literagePercentageLast = grossLiterageLastWeek?.gallon_last_history_date?.toISOString().split('T')[0] !== actualdateLastWeek.toString().split('T')[0] ?
          (monthBigNumbers?.bignumbers_dailyLiterageProfit || 0) + 2450 : grossLiterageLastWeek?.gallon_last_history_gross

        const grossProductLastWeek = await prismaRedeFlex.product_gross_last_week.findFirst({
          select: { product_last_history_gross: true, product_last_history_date: true },
          where: { product_last_history_date: { gt: actualdateLastWeek }, use_uuid: id },
          orderBy: { product_last_history_date: 'asc' }
        })


        const productPercentageLast = grossProductLastWeek?.product_last_history_date?.toISOString().split('T')[0] !== actualdateLastWeek.toString().split('T')[0] ?
          (monthBigNumbers?.bignumbers_dailyProductProfit || 0) + 1050 : grossProductLastWeek?.product_last_history_gross

        //Mlt semana passada

        const mltLastWeek = await prismaRedeFlex.mlt_history.findFirst({
          select: { mlt_history_value: true, mlt_history_date: true },
          where: {
            mlt_history_date: {
              gte: startOfDay,
              lte: endOfDay,
            }, use_uuid: id
          },
          orderBy: { mlt_history_date: 'asc' }
        })

        const mltPercentageLast = mltLastWeek?.mlt_history_date?.toISOString().split('T')[0] !== actualdateLastWeek.toString().split('T')[0] ?
          0.49 : mltLastWeek?.mlt_history_value || 0






        //Fluxo mlt por tipo combustível

        const token = process.env.SAULOAPI;
        const tableData = await axios.get(
          `${process.env.NEXT_PUBLIC_DATAFRAME_EXTERN_API}/dataframes?token=${token}`
        );
        const fuelArray = [
          "GASOLINA COMUM",
          "GAS NATURAL VEICULAR",
          "OLEO DIESEL B S10 COMUM",
          "ETANOL HIDRATADO COMBUSTIVEL",
          "OLEO DIESEL B S500 COMUM",
          "GASOLINA PREMIUM PODIUM",
        ];

        const literagePerFuel = tableData.data["combustivel"]
          .map((element: any) => {
            if (
              element.hasOwnProperty("Combustivel") &&
              fuelArray.includes(element["Combustivel"])
            ) {
              return element;
            }
            return null;
          })
          .filter((value: object) => value !== null);

        let arrayFuel: { [key: string]: number[] } = {};

        literagePerFuel.forEach((element: any) => {
          if (!arrayFuel[element["Combustivel"]]) {
            arrayFuel[element["Combustivel"]] = [element["Lucro"]];
          } else {
            arrayFuel[element["Combustivel"]].push(element["Lucro"]);
          }
        });
        const fuelSums: { [key: string]: number } = {};

        for (const fuelType in arrayFuel) {
          fuelSums[fuelType] = arrayFuel[fuelType].reduce(
            (sum, value) => Math.round((sum + value) * 100) / 100,
            0
          );
        }

        let arrayFuelVolume: { [key: string]: number[] } = {};

        literagePerFuel.forEach((element: any) => {
          if (!arrayFuelVolume[element["Combustivel"]]) {
            arrayFuelVolume[element["Combustivel"]] = [element["Volume"]];
          } else {
            arrayFuelVolume[element["Combustivel"]].push(element["Volume"]);
          }
        });
        const fuelSumsVolume: { [key: string]: number } = {};

        for (const fuelType in arrayFuelVolume) {
          fuelSumsVolume[fuelType] = arrayFuelVolume[fuelType].reduce(
            (sum, value) => Math.round((sum + value) * 100) / 100,
            0
          );
        }

        //Lucro Bruto semana passada
        const productProfitLastWeek =
          Math.round((sumFuelProdLastWeek - sumProductPriceLastWeek) * 100) /
          100;
        const fuelProfitLastWeek =
          Math.round(
            (sumFuelLastWeek -
              sumCostPriceLastWeek -
              sumLiterageLastWeek * 0.04) *
            100
          ) / 100;

        const secondary_value_bruto_operacionalLastWeek =
          sumFuelTotalLastWeek !== 0
            ? ((productProfitLastWeek + fuelProfitLastWeek) /
              sumFuelTotalLastWeek) *
            100
            : 0;

        //Comparação flag dia atual com -7 dias
        const literageTodayLastWeekFlag =
          Math.round(sumLiterage * 100) / 100 >=
          Math.round(sumLiterageLastWeek * 100) / 100;
        const sumFuelTotalTodayLastWeekFlag =
          Math.round(sumFuelTotal * 100) / 100 >=
          Math.round(sumFuelTotalLastWeek * 100) / 100;
        const quantSupplyTodayLastWeekFlag =
          Math.round(quantSupply * 100) / 100 >=
          Math.round(quantSupplyLastWeek * 100) / 100;
        const sumFuelTodayLastWeekFlag =
          Math.round(sumFuel * 100) / 100 >=
          Math.round(sumFuelLastWeek * 100) / 100;
        const literageProfitTodayLastWeekFlag =
          (monthBigNumbers?.bignumbers_dailyLiterageProfit || 0) >= (grossLiterageLastWeek?.gallon_last_history_gross || 0)
        const productProfitTodayLastWeekFlag = (monthBigNumbers?.bignumbers_dailyProductProfit || 0) >= (grossProductLastWeek?.product_last_history_gross || 0)
        const sumFuelProdTodayLastWeekFlag =
          Math.round(sumFuelProd * 100) / 100 >=
          Math.round(sumFuelProdLastWeek * 100) / 100;
        const value_bruto =
          Math.round(secondary_value_bruto_operacional * 100) / 100 >=
          Math.round(secondary_value_bruto_operacionalLastWeek * 100) / 100;
        const portugueseDateFormat = moment()
          .locale("pt")
          .tz("America/Sao_Paulo")
          .subtract(7, "days")
          .format("dddd");
        const portugueseDate =
          portugueseDateFormat === "Sábado" ||
            portugueseDateFormat === "Domingo"
            ? `Último ${portugueseDateFormat}`
            : `Última ${portugueseDateFormat}`;
        //Formatando porcentagens

        const literagePercentage =
          sumLiterage / sumLiterageLastWeek < 1
            ? Math.round(100 - (sumLiterage / sumLiterageLastWeek) * 100)
            : Math.round((sumLiterage / sumLiterageLastWeek) * 100 - 100);
        const sumFuelTotalPercentage =
          sumFuelTotal / sumFuelTotalLastWeek < 1
            ? Math.round(100 - (sumFuelTotal / sumFuelTotalLastWeek) * 100)
            : Math.round((sumFuelTotal / sumFuelTotalLastWeek) * 100 - 100);
        const quantSupplyPercentage =
          quantSupply / quantSupplyLastWeek < 1
            ? Math.round(100 - (quantSupply / quantSupplyLastWeek) * 100)
            : Math.round((quantSupply / quantSupplyLastWeek) * 100 - 100);
        const sumFuelPercentage =
          sumFuel / sumFuelLastWeek < 1
            ? Math.round(100 - (sumFuel / sumFuelLastWeek) * 100)
            : Math.round((sumFuel / sumFuelLastWeek) * 100 - 100);
        const sumFuelProdPercentage =
          sumFuelProd / sumFuelProdLastWeek < 1
            ? Math.round(100 - (sumFuelProd / sumFuelProdLastWeek) * 100)
            : Math.round((sumFuelProd / sumFuelProdLastWeek) * 100 - 100);
        const grossProfitPercentage =
          secondary_value_bruto_operacional /
            secondary_value_bruto_operacionalLastWeek <
            1
            ?

            Math.ceil(
              Math.abs(
                (Math.round(secondary_value_bruto_operacional * 100) / 100) -
                (Math.round(secondary_value_bruto_operacionalLastWeek * 100) / 100)
              ) * 100
            ) / 100

            :
            Math.ceil(
              Math.abs(
                (Math.round(secondary_value_bruto_operacional * 100) / 100) -
                (Math.round(secondary_value_bruto_operacionalLastWeek * 100) / 100)
              ) * 100
            ) / 100;
        const grossLiterageLastPercentage = ((monthBigNumbers?.bignumbers_dailyLiterageProfit) || 0) / (literagePercentageLast || 0) < 1
          ? Math.round(100 - (((monthBigNumbers?.bignumbers_dailyLiterageProfit) || 0) / (literagePercentageLast || 0)) * 100)
          : Math.round((((monthBigNumbers?.bignumbers_dailyLiterageProfit) || 0) / (literagePercentageLast || 0)) * 100 - 100);

        const grossProductLastPercentage = ((monthBigNumbers?.bignumbers_dailyProductProfit) || 0) / (productPercentageLast || 0) < 1
          ? Math.round(100 - (((monthBigNumbers?.bignumbers_dailyProductProfit) || 0) / (productPercentageLast || 0)) * 100)
          : Math.round((((monthBigNumbers?.bignumbers_dailyProductProfit) || 0) / (productPercentageLast || 0)) * 100 - 100);
        const flagGalllon = ((monthBigNumbers?.bignumbers_dailyLiterageProfit || 0) < (literagePercentageLast || 0)) ? false : true;

        const flagProduct = ((monthBigNumbers?.bignumbers_dailyProductProfit || 0) < (productPercentageLast || 0)) ? false : true;


        //Lucro bruto Modificado
        const value1 =
          sumFuelTotal !== 0
            ? (((monthBigNumbers?.bignumbers_dailyProductProfit || 0) + (monthBigNumbers?.bignumbers_dailyLiterageProfit || 0)) / sumFuelTotal) * 100
            : 0;

        const value2 =
          sumFuelTotalLastWeek !== 0
            ? (((productPercentageLast || 0) + (literagePercentageLast || 0)) /
              sumFuelTotalLastWeek) *
            100
            : 0;
        const value_bruto1 =
          Math.round(value1 * 100) / 100 >=
          Math.round(value2 * 100) / 100;

        const formatNumber = (value: any, decimals = 2) => {
          return new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
          }).format(value);
        };
        const grossProfitPercentage1 =
          value1 /
            value2 <
            1
            ?

            Math.ceil(
              Math.abs(
                (Math.round(value1 * 100) / 100) -
                (Math.round(value2 * 100) / 100)
              ) * 100
            ) / 100

            :
            Math.ceil(
              Math.abs(
                (Math.round(value1 * 100) / 100) -
                (Math.round(value2 * 100) / 100)
              ) * 100
            ) / 100;

        //Comparativo e ultima semana MLT
        const mltcomp =
          Math.round(
            ((fuelSums["GASOLINA COMUM"] +
              fuelSums["GAS NATURAL VEICULAR"] +
              fuelSums["GASOLINA PREMIUM PODIUM"] +
              fuelSums["OLEO DIESEL B S10 COMUM"] +
              fuelSums["OLEO DIESEL B S500 COMUM"] +
              fuelSums["ETANOL HIDRATADO COMBUSTIVEL"]) /
              (fuelSumsVolume["GASOLINA COMUM"] +
                fuelSumsVolume["GAS NATURAL VEICULAR"] +
                fuelSumsVolume["GASOLINA PREMIUM PODIUM"] +
                fuelSumsVolume["OLEO DIESEL B S10 COMUM"] +
                fuelSumsVolume["OLEO DIESEL B S500 COMUM"] +
                fuelSumsVolume["ETANOL HIDRATADO COMBUSTIVEL"])) *
            100
          ) / 100
        

        //Novo MLT

        interface FuelEntry {
          Combustivel: string;
          "M/LT": number;
          "Nome da Empresa": string;
          "Hora da Venda": string;
        }
        const latestMLTByCompany: Record<string, FuelEntry> = {};

        literagePerFuel.forEach((entry: any) => {
          const company = entry["Nome da Empresa"];
          const timestamp = new Date(entry["Hora da Venda"]).getTime();

          if (!latestMLTByCompany[company] || timestamp > new Date(latestMLTByCompany[company]["Hora da Venda"]).getTime()) {
            latestMLTByCompany[company] = entry;
          }
        });

        let totalMLT = 0;
        let count = 0;

        Object.values(latestMLTByCompany).forEach((entry) => {
          totalMLT += entry["M/LT"];
          count += 1;
        });
        
        const averageMLT = count > 0 ? parseFloat((totalMLT / count).toFixed(2)) : 0
        const comparativoMLT = averageMLT < mltPercentageLast ? false : true
        const sumMLTPercentage =
        averageMLT / mltPercentageLast < 1
            ? Math.round(100 - (averageMLT / mltPercentageLast) * 100)
            : Math.round((averageMLT / mltPercentageLast) * 100 - 100);

        return res.status(200).json({
          data: [
            [
              {
                label: "Galonagem em Litros",
                value: formatNumber(sumLiterage),
                secondary_label: "TM VOL",
                secondary_value: formatNumber(secondary_value_galonagem),
                third_label: "Status Margem",
                third_value: use_tmvol,
                fourth_label: "Alvo",
                fourth_value: formatNumber(flags?.use_tmvol || 0),
                fifth_label: "Soma mensal",
                fifth_value: formatNumber(monthBigNumbers?.bignumbers_sumliterage || 0),
                sixth_label: "Status Média",
                sixth_value: galonagemLitrosCondição,
                seventh_label: "Média Mensal",
                seventh_value: formatNumber(
                  (Math.round(
                    ((monthBigNumbers?.bignumbers_sumliterage ?? 0) / actualDay) * 100
                  ) / 100)
                ),
                eighth_label: `${portugueseDate}`,
                eighth_value: formatNumber(sumLiterageLastWeek),
                ninth_label: "% ult. semana",
                ninth_value: literagePercentage.toFixed(0),
                tenth_label: "Flag Comparativo entre semanas",
                tenth_value: literageTodayLastWeekFlag,
                unit_type: "gallon",
              },
              {
                label: "Faturamento da Rede",
                value: formatNumber(sumFuelTotal),
                secondary_label: "TMF",
                secondary_value: formatNumber(secondary_value_fuel),
                third_label: "Status Margem",
                third_value: use_tmf,
                fourth_label: "Alvo",
                fourth_value: formatNumber(flags?.use_tmf || 0),
                fifth_label: "Soma mensal",
                fifth_value: formatNumber(monthBigNumbers?.bignumbers_invoicing || 0),
                sixth_label: "Status Média",
                sixth_value: faturamentoRedeCondição,
                seventh_label: "Média Mensal",
                seventh_value: formatNumber(
                  (Math.round(
                    ((monthBigNumbers?.bignumbers_invoicing ?? 0) / actualDay) * 100
                  ) / 100)
                ),
                eighth_label: `${portugueseDate}`,
                eighth_value: formatNumber(sumFuelTotalLastWeek),
                ninth_label: "% ult. semana",
                ninth_value: sumFuelTotalPercentage.toFixed(0),
                tenth_label: "Flag Comparativo entre semanas",
                tenth_value: sumFuelTotalTodayLastWeekFlag,
                unit_type: "real",
              },
              {
                label: "Abastecimentos a Rede",
                value: formatNumber(quantSupply, 0),  // 0 casas decimais
                secondary_label: "",
                secondary_value: "0",
                third_label: "",
                third_value: "0",
                fourth_label: "",
                fourth_value: "0",
                fifth_label: "Soma mensal",
                fifth_value: formatNumber(monthBigNumbers?.bignumbers_Supplies || 0, 0),  // 0 casas decimais
                sixth_label: "Status Média",
                sixth_value: abastecimentoRedeCondição,
                seventh_label: "Média Mensal",
                seventh_value: formatNumber(
                  (Math.round(
                    ((monthBigNumbers?.bignumbers_Supplies ?? 0) / actualDay) * 100
                  ) / 100),
                  0  // 0 casas decimais
                ),
                eighth_label: `${portugueseDate}`,
                eighth_value: formatNumber(quantSupplyLastWeek, 0),  // 0 casas decimais
                ninth_label: "% ult. semana",
                ninth_value: quantSupplyPercentage.toFixed(0),
                tenth_label: "Flag Comparativo entre semanas",
                tenth_value: quantSupplyTodayLastWeekFlag,
                unit_type: "gallon",
              },
            ],
            [
              {
                label: "Venda de Combustíveis",
                value: formatNumber(sumFuel),
                secondary_label: "TMC",
                secondary_value: formatNumber(secondary_value_tmc),
                third_label: "Status Margem",
                third_value: tmc,
                fourth_label: "Alvo",
                fourth_value: formatNumber(flags?.use_tmc || 0),
                fifth_label: "Soma mensal",
                fifth_value: formatNumber(monthBigNumbers?.bignumbers_fuelSales || 0),
                sixth_label: "Status Média",
                sixth_value: vendaCombustíveisCondição,
                seventh_label: "Média Mensal",
                seventh_value: formatNumber(
                  (Math.round(
                    ((monthBigNumbers?.bignumbers_fuelSales ?? 0) / actualDay) * 100
                  ) / 100)
                ),
                eighth_label: `${portugueseDate}`,
                eighth_value: formatNumber(sumFuelLastWeek),
                ninth_label: "% ult. semana",
                ninth_value: sumFuelPercentage.toFixed(0),
                tenth_label: "Flag Comparativo entre semanas",
                tenth_value: sumFuelTodayLastWeekFlag,
                unit_type: "real",
              },
              {
                label: "Resultado Bruto da Galonagem",
                value: formatNumber(monthBigNumbers?.bignumbers_dailyLiterageProfit || 0),
                secondary_label: "",
                secondary_value: "0",
                third_label: "Status Margem",
                third_value: lucro_operacional_galonagem,
                fourth_label: "Alvo",
                fourth_value: formatNumber(flags?.use_lucro_bruto_operacional_galonagem ?? 0),
                fifth_label: "Soma mensal",
                fifth_value: formatNumber(monthBigNumbers?.bignumbers_fuelProfit || 0),
                sixth_label: "Status Média",
                sixth_value: lucroCombustíveisCondição,
                seventh_label: "Média Mensal",
                seventh_value: formatNumber(
                  (Math.round(
                    ((monthBigNumbers?.bignumbers_fuelProfit ?? 0) / actualDay) * 100
                  ) / 100)
                ),
                eighth_label: `${portugueseDate}`,
                eighth_value: formatNumber(literagePercentageLast || 0),
                ninth_label: "% ult. semana",
                ninth_value: grossLiterageLastPercentage.toFixed(0),
                tenth_label: "Flag Comparativo entre semanas",
                tenth_value: flagGalllon,
                unit_type: "real",
              },
              {
                // formatNumber(
                //   (Math.round(
                //     ((fuelSums["GASOLINA COMUM"] +
                //       fuelSums["GAS NATURAL VEICULAR"] +
                //       fuelSums["GASOLINA PREMIUM PODIUM"] +
                //       fuelSums["OLEO DIESEL B S10 COMUM"] +
                //       fuelSums["OLEO DIESEL B S500 COMUM"] +
                //       fuelSums["ETANOL HIDRATADO COMBUSTIVEL"]) /
                //       (fuelSumsVolume["GASOLINA COMUM"] +
                //         fuelSumsVolume["GAS NATURAL VEICULAR"] +
                //         fuelSumsVolume["GASOLINA PREMIUM PODIUM"] +
                //         fuelSumsVolume["OLEO DIESEL B S10 COMUM"] +
                //         fuelSumsVolume["OLEO DIESEL B S500 COMUM"] +
                //         fuelSumsVolume["ETANOL HIDRATADO COMBUSTIVEL"])) *
                //     100
                //   ) / 100),
                //   2 // 0 casas decimais
                // )
                label: "M/LT",
                value: averageMLT,
                secondary_label: "",
                secondary_value: "0",
                third_label: "Status Margem",
                third_value: mlt,
                fourth_label: "Alvo",
                fourth_value: formatNumber(flags?.use_mlt ?? 2),
                fifth_label: "",
                fifth_value: "0",
                sixth_label: "",
                sixth_value: "0",
                seventh_label: "",
                seventh_value: "0",
                eighth_label: `${portugueseDate}`,
                eighth_value: formatNumber(mltPercentageLast, 2),  // 0 casas decimais
                ninth_label: "% ult. semana",
                ninth_value: formatNumber(sumMLTPercentage, 0),
                tenth_label: "Flag Comparativo entre semanas",
                tenth_value: comparativoMLT,
                unit_type: "real_per_gallon",
              },
            ],
            [
              {
                label: "Venda de Produtos",
                value: formatNumber(sumFuelProd, 2),  // 0 casas decimais
                secondary_label: "TMP",
                secondary_value: formatNumber(secondary_value_produto),
                third_label: "Status Margem",
                third_value: use_tmp,
                fourth_label: "Alvo",
                fourth_value: formatNumber(flags?.use_tmp || 0),
                fifth_label: "Soma mensal",
                fifth_value: formatNumber(monthBigNumbers?.bignumbers_productSales || 0, 2),  // 0 casas decimais
                sixth_label: "Status Média",
                sixth_value: vendaProdutosCondição,
                seventh_label: "Média Mensal",
                seventh_value: formatNumber(
                  (Math.round(
                    ((monthBigNumbers?.bignumbers_productSales ?? 0) / actualDay) * 100
                  ) / 100),
                  2
                ),
                eighth_label: `${portugueseDate}`,
                eighth_value: formatNumber(sumFuelProdLastWeek, 2),  // 0 casas decimais
                ninth_label: "% ult. semana",
                ninth_value: sumFuelProdPercentage.toFixed(0),
                tenth_label: "Flag Comparativo entre semanas",
                tenth_value: sumFuelProdTodayLastWeekFlag,
                unit_type: "real",
              },

              {
                label: "Resultado Bruto de Produto",
                value: formatNumber(monthBigNumbers?.bignumbers_dailyProductProfit),
                // secondary_label: "Resultado Bruto Operacional", secondary_value: productProfit,
                secondary_label: "",
                secondary_value: "0",
                third_label: "Status Margem",
                third_value: formatNumber(lucro_operacional_produto),
                fourth_label: "Alvo",
                fourth_value: formatNumber(flags?.use_lucro_bruto_operacional_produto),
                fifth_label: "Soma mensal",
                fifth_value: formatNumber(monthBigNumbers?.bignumbers_productProfit),
                sixth_label: "Status Média",
                sixth_value: formatNumber(lucroProdutosCondição),
                seventh_label: "Média Mensal",
                seventh_value: formatNumber(
                  (Math.round(
                    ((monthBigNumbers?.bignumbers_productProfit ?? 0) / actualDay) * 100
                  ) / 100)
                ),
                eighth_label: `${portugueseDate}`,
                eighth_value: formatNumber(productPercentageLast),
                ninth_label: "% ult. semana",
                ninth_value: formatNumber(grossProductLastPercentage, 0),
                tenth_label: "Flag Comparativo entre semanas",
                tenth_value: flagProduct,
                unit_type: "real",
              },
              {
                label: "Lucro Bruto",
                value:
                  formatNumber(value1),
                secondary_label: "",
                secondary_value: "0",
                third_label: "Status Margem",
                third_value: formatNumber(lucro_operacional_geral),
                fourth_label: "Alvo",
                fourth_value: formatNumber(flags?.use_lucro_bruto_operacional),
                fifth_label: "",
                fifth_value: "0",
                sixth_label: "",
                sixth_value: "0",
                seventh_label: "",
                seventh_value: "0",
                eighth_label: `${portugueseDate}`,
                eighth_value:
                  formatNumber(value2),
                ninth_label: "% ult. semana",
                ninth_value:
                  formatNumber(grossProfitPercentage1, 2),
                tenth_label: "Flag Comparativo entre semanas",
                tenth_value: value_bruto1,
                unit_type: "percentage",
              },
            ]
          ],

        });
      } else {
        return res
          .status(401)
          .json({ message: "Falha na autenticação: Token inválido." });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: `Erro ao retornar os dados: ${error}` });
    }
  }
  public async bigNumbersMLT(req: Request, res: Response) {
    try {
      interface FuelEntry {
        Combustivel: string;
        "M/LT": number;
        "Hora da Venda": string;
      }

      interface FuelStats {
        totalMLT: number;
        count: number;
      }

      interface FuelResult {
        fuel_name: string;
        value: number;
      }
      const actualdate = moment().tz("America/Sao_Paulo").format("YYYY-MM-DD");
      const actualdateOne = moment().tz("America/Sao_Paulo").subtract(1, "days").format("YYYY-MM-DD");
      const clientToken = req.headers.authorization;
      const { use_token }: any = req.params;

      if (!clientToken) {
        return res.status(401).json({ message: "Token não fornecido." });
      }

      const expectedToken = process.env.TOKEN;
      if (clientToken === `Bearer ${expectedToken}`) {
        const token = process.env.SAULOAPI;
        const response = await axios.get<{ combustivel: FuelEntry[] }>(
          `${process.env.NEXT_PUBLIC_DATAFRAME_EXTERN_API}/dataframes?token=${token}`
        );
        const tableData = response.data["combustivel"];

        const fuelArray: string[] = [
          "GASOLINA COMUM",
          "GAS NATURAL VEICULAR",
          "OLEO DIESEL B S10 COMUM",
          "ETANOL HIDRATADO COMBUSTIVEL",
          "OLEO DIESEL B S500 COMUM",
          "GASOLINA PREMIUM PODIUM",
        ];

        const latestMLTByFuel: Record<string, FuelEntry> = {};

        tableData.forEach((entry) => {
          const fuelType = entry["Combustivel"];
          const timestamp = new Date(entry["Hora da Venda"]).getTime();

          if (fuelArray.includes(fuelType)) {
            if (!latestMLTByFuel[fuelType] || timestamp > new Date(latestMLTByFuel[fuelType]["Hora da Venda"]).getTime()) {
              latestMLTByFuel[fuelType] = entry;
            }
          }
        });

        const fuelStats: Record<string, FuelStats> = {};

        Object.values(latestMLTByFuel).forEach((entry) => {
          const fuelType = entry["Combustivel"];
          const mlt = parseFloat(entry["M/LT"].toString());

          if (!fuelStats[fuelType]) {
            fuelStats[fuelType] = { totalMLT: 0, count: 0 };
          }

          fuelStats[fuelType].totalMLT += mlt;
          fuelStats[fuelType].count += 1;
        });

        const result = {
          data: Object.keys(fuelStats).map((fuelType) => ({
            fuel_name: fuelType,
            value: parseFloat((fuelStats[fuelType].totalMLT / fuelStats[fuelType].count).toFixed(4)),
          })),
        };

        return res.status(200).json({ data: result["data"] });

        // let fuelliterageSell;

        // fuelliterageSell = await prismaLBCBi.combustiveis.findMany({
        //   select: {
        //     vda: true,
        //     cus: true,
        //     des: true,
        //     ibm: true,
        //     del: true,
        //   },
        //   where: {
        //     dtHr: {
        //       gte: `${actualdate}T00:00:00.000Z`,
        //       lte: `${actualdate}T23:59:59.999Z`,
        //     },
        //     AND: [
        //       { vda: { not: "" } },
        //       { cus: { not: "" } },
        //       { des: { not: "" } },
        //       { ibm: { not: "" } },
        //       { del: { not: "" } },
        //     ],
        //   },
        // });

        // if (Array.isArray(fuelliterageSell) && fuelliterageSell.length === 0) {
        //   fuelliterageSell = await prismaLBCBi.combustiveis.findMany({
        //     select: {
        //       vda: true,
        //       cus: true,
        //       des: true,
        //       ibm: true,
        //       del: true,
        //     },
        //     where: {
        //       dtHr: {
        //         gte: `${actualdateOne}T00:00:00.000Z`,
        //         lte: `${actualdateOne}T23:59:59.999Z`,
        //       },
        //       AND: [
        //         { vda: { not: "" } },
        //         { cus: { not: "" } },
        //         { des: { not: "" } },
        //         { ibm: { not: "" } },
        //         { del: { not: "" } },
        //       ],
        //     },
        //   });
        // }

        // console.log(fuelliterageSell);
        // let stationsMapping: any = {};
        // const secret = process.env.SECRET;
        // if (!secret) {
        //   throw new Error("Chave secreta não definida. Verifique a variável de ambiente SECRET.");
        // }

        // const id = extractUserIdFromToken(use_token, secret);

        // fuelliterageSell.forEach((element) => {
        //   if (element.del === "F") {
        //     if (!stationsMapping[element.ibm]) {
        //       stationsMapping[element.ibm] = [
        //         {
        //           value: parseFloat(element.vda),
        //           cost: parseFloat(element.cus),
        //           description: element.des,
        //         },
        //       ];
        //     } else {
        //       stationsMapping[element.ibm].push({
        //         value: parseFloat(element.vda),
        //         cost: parseFloat(element.cus),
        //         description: element.des,
        //       });
        //     }
        //   }
        // });

        // const stationNames = await prismaRedeFlex.gas_station_setvariables.findMany({
        //   select: {
        //     ibm_info: {
        //       select: {
        //         ibm: true,
        //         nomefantasia: true,
        //       },
        //     },
        //     gas_station_GASOLINA_COMUM_comb: true,
        //     gas_station_ETANOL_COMUM_comb: true,
        //     gas_station_OLEO_DIESEL_B_S10_COMUM_comb: true,
        //     gas_station_OLEO_DIESEL_B_S500_COMUM_comb: true,
        //   },
        //   where: { use_uuid: id },
        // });

        // let stationsMlt: any = [];
        // for (let keys in stationsMapping) {
        //   const result = stationNames.find(
        //     (item) => item.ibm_info?.ibm === keys
        //   );

        //   stationsMapping[keys].forEach((element: any) => {
        //     if (element !== stationsMapping[keys].at(-1)) {
        //       let mltValue = 0;
        //       if (element.description === "GASOLINA COMUM") {
        //         mltValue =
        //           element.value -
        //           element.cost -
        //           (result?.gas_station_GASOLINA_COMUM_comb || 0);
        //       } else if (element.description === "OLEO DIESEL B S10 COMUM") {
        //         mltValue =
        //           element.value -
        //           element.cost -
        //           (result?.gas_station_OLEO_DIESEL_B_S10_COMUM_comb || 0);
        //       } else if (element.description === "OLEO DIESEL B S500 COMUM") {
        //         mltValue =
        //           element.value -
        //           element.cost -
        //           (result?.gas_station_OLEO_DIESEL_B_S500_COMUM_comb || 0);
        //       } else if (element.description === "ETANOL HIDRATADO COMBUSTIVEL") {
        //         mltValue =
        //           element.value -
        //           element.cost -
        //           (result?.gas_station_ETANOL_COMUM_comb || 0);
        //       } else {
        //         mltValue = element.value - element.cost;
        //       }

        //       stationsMlt.push({
        //         name: result?.ibm_info?.nomefantasia,
        //         mlt: mltValue,
        //         fuel_name: element.description,
        //       });
        //     }
        //   });
        // }

        // let fuelAggregation: any = {};

        // stationsMlt.forEach((element: any) => {
        //   if (!fuelAggregation[element.fuel_name]) {
        //     fuelAggregation[element.fuel_name] = [];
        //   }
        //   fuelAggregation[element.fuel_name].push(element.mlt);
        // });

        // const aggregatedResult = Object.keys(fuelAggregation).map(
        //   (fuel_name) => {
        //     const values = fuelAggregation[fuel_name];
        //     const sum = values.reduce((acc: number, val: number) => acc + val, 0);
        //     const average = sum / values.length;

        //     return {
        //       fuel_name,
        //       value: Math.round(average * 10000) / 10000,
        //     };
        //   }
        // );
        // ""
        // const allowedFuels = [
        //   "GASOLINA COMUM",
        //   "OLEO DIESEL B S10 COMUM",
        //   "OLEO DIESEL B S500 COMUM",
        //   "ETANOL HIDRATADO COMBUSTIVEL",
        //   "GAS NATURAL VEICULAR",
        //   "GASOLINA PREMIUM PODIUM",
        // ];

        // const allowedFuelsArray = aggregatedResult.filter((element: any) =>
        //   allowedFuels.includes(element.fuel_name)
        // );

        // return res.status(200).json({
        //   data: allowedFuelsArray,
        // });
      } else {
        return res
          .status(401)
          .json({ message: "Falha na autenticação: Token inválido." });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: `Erro ao retornar os dados: ${error}` });
    }
  }


  //Dados do Gráfico diário
  public async dailyGraphic(req: Request, res: Response) {
    try {
      const clientToken = req.headers.authorization;
      if (!clientToken) {
        return res.status(401).json({ message: "Token não fornecido." });
      }
      const {
        week_day,
        variable_type,
      }: { week_day: string; variable_type: string } = req.body;
      const expectedToken = process.env.TOKEN;
      if (clientToken == `Bearer ${expectedToken}`) {
        //Fuso Horário
        const timezone = "America/Sao_Paulo";

        //Data atual com ano e mês
        const actualdate = moment().tz(timezone).format("YYYY-MM");
        const actualYear = parseInt(actualdate.split("-")[0]);
        const actualMonth = parseInt(actualdate.split("-")[1]);

        //Primeiro e último dia do mês
        const firstDayweek = moment.tz(timezone).startOf("month");
        const lastDayweek = moment.tz(timezone).endOf("month");

        // Agregar os dias da semana
        const daysOfWeek: { [key: string]: string[] } = {};
        let currentDay = firstDayweek.clone();

        while (
          currentDay.isBefore(lastDayweek) ||
          currentDay.isSame(lastDayweek)
        ) {
          const dayOfWeek = currentDay.format("dddd");
          const formattedDate = currentDay.format("YYYY-MM-DD");

          if (!daysOfWeek[dayOfWeek]) {
            daysOfWeek[dayOfWeek] = [];
          }

          daysOfWeek[dayOfWeek].push(formattedDate);
          currentDay.add(1, "day");
        }
        let dateRanges;
        for (let week in daysOfWeek) {
          if (week_day == week) {
            dateRanges = daysOfWeek[week];
          }
        }

        const multiplesInterval: any = dateRanges?.map((element) => {
          return {
            dtHr: {
              gte: `${element}T00:00:00.000Z`,
              lte: `${element}T23:59:59.999Z`,
            },
          };
        });

        const fuelliterageSell = await prismaSales.vendas.findMany({
          select: { items: true, dtHr: true },
          where: {
            OR: multiplesInterval,
          },
        });

        let dateSeparation: any = {};
        dateRanges?.forEach((element) => {
          dateSeparation[element] = [];
        });
        fuelliterageSell.forEach((element) => {
          const date = new Date(element.dtHr).toISOString().split("T")[0];
          dateSeparation[date].push(...element.items);
        });
        interface DateSum {
          date: string;
          sum: number;
        }
        let sumArray: DateSum[] = [];

        for (const date in dateSeparation) {
          if (dateSeparation.hasOwnProperty(date)) {
            const itemsArray = dateSeparation[date];

            if (itemsArray.length == 0) {
              sumArray.push({ date: date, sum: 0 });
              continue;
            }
            let total = 0;
            let quantity = 0;

            const sum = itemsArray.reduce(
              (accumulate: any, initialValue: any) => {
                if (initialValue.iTip == "1") {
                  const value = parseFloat(initialValue.tot);
                  const quantityValue = parseFloat(initialValue.qd);
                  const cost = parseFloat(initialValue.pC);

                  if (variable_type == "invoicing") {
                    return accumulate + value;
                  } else if (variable_type == "volume_sold") {
                    return accumulate + quantityValue;
                  } else if (variable_type == "cost") {
                    return accumulate + cost;
                  } else if (variable_type == "fuel_margin") {
                    total += value;
                    quantity += quantityValue;
                    return total / quantity;
                  }
                }
                return Math.round(accumulate * 100) / 100;
              },
              0
            );

            sumArray.push({ date: date, sum: sum });
          }
        }
        sumArray.forEach((element) => {
          const [year, month, day] = element.date.split("-");
          element.date = `${day}-${month}-${year}`;
        });

        return res.status(200).json({ data: sumArray });
      } else {
        return res
          .status(401)
          .json({ message: "Falha na autenticação: Token inválido." });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: `Erro ao retornar os dados: ${error}` });
    }
  }
  //Galonagem
  public async dailyGraphicFuel(req: Request, res: Response) {
    try {
      const clientToken = req.headers.authorization;
      if (!clientToken) {
        return res.status(401).json({ message: "Token não fornecido." });
      }
      const {
        week_day,
        variable_type,
      }: { week_day: string; variable_type: string } = req.body;
      const expectedToken = process.env.TOKEN;
      if (clientToken == `Bearer ${expectedToken}`) {
        //Fuso Horário
        const timezone = "America/Sao_Paulo";

        //Data atual com ano e mês
        const actualdate = moment().tz(timezone).format("YYYY-MM");
        const actualYear = parseInt(actualdate.split("-")[0]);
        const actualMonth = parseInt(actualdate.split("-")[1]);

        //Primeiro e último dia do mês
        const firstDayweek = moment.tz(timezone).startOf("month");
        const lastDayweek = moment.tz(timezone).endOf("month");

        // Agregar os dias da semana
        const daysOfWeek: { [key: string]: string[] } = {};
        let currentDay = firstDayweek.clone();

        while (
          currentDay.isBefore(lastDayweek) ||
          currentDay.isSame(lastDayweek)
        ) {
          const dayOfWeek = currentDay.format("dddd");
          const formattedDate = currentDay.format("YYYY-MM-DD");

          if (!daysOfWeek[dayOfWeek]) {
            daysOfWeek[dayOfWeek] = [];
          }

          daysOfWeek[dayOfWeek].push(formattedDate);
          currentDay.add(1, "day");
        }
        let dateRanges;
        for (let week in daysOfWeek) {
          if (week_day == week) {
            dateRanges = daysOfWeek[week];
          }
        }
        const multiplesInterval: any = dateRanges?.map((element) => {
          return {
            dtHr: {
              gte: `${element}T00:00:00.000Z`,
              lte: `${element}T23:59:59.999Z`,
            },
          };
        });
        const fuelliterageSell = await prismaSales.vendas.findMany({
          select: {
            dtHr: true,
            items: {
              select: {
                iTip: true,
                tot: true,
                qd: true,
                pC: true,
              },
            },
          },
          where: {
            OR: multiplesInterval,
          },
        });
        let dateSeparation: any = {};
        dateRanges?.forEach((element) => {
          dateSeparation[element] = [];
        });
        fuelliterageSell.forEach((element) => {
          const date = new Date(element.dtHr).toISOString().split("T")[0];
          dateSeparation[date].push(...element.items);
        });
        interface DateSum {
          date: string;
          sum: number;
        }
        let sumArray: DateSum[] = [];

        for (const date in dateSeparation) {
          if (dateSeparation.hasOwnProperty(date)) {
            const itemsArray = dateSeparation[date];

            if (itemsArray.length == 0) {
              sumArray.push({ date: date, sum: 0 });
              continue;
            }
            let total = 0;
            let quantity = 0;

            const sum = itemsArray.reduce(
              (accumulate: any, initialValue: any) => {
                if (initialValue.iTip == "1") {
                  const value = parseFloat(initialValue.tot);
                  const quantityValue = parseFloat(initialValue.qd);
                  const cost = parseFloat(initialValue.pC);

                  if (variable_type == "invoicing") {
                    return Math.round((accumulate + value) * 100) / 100;
                  } else if (variable_type == "volume_sold") {
                    return Math.round((accumulate + quantityValue) * 100) / 100;
                  } else if (variable_type == "cost") {
                    return (
                      Math.round((accumulate + quantityValue * cost) * 100) /
                      100
                    );
                  } else if (variable_type == "fuel_margin") {
                    total += value;
                    quantity += quantityValue;
                    return Math.round((total / quantity) * 100) / 100;
                  }
                }
                return accumulate;
              },
              0
            );
            sumArray.push({ date: date, sum: sum });
          }
        }
        sumArray.forEach((element) => {
          const [year, month, day] = element.date.split("-");
          element.date = `${day}-${month}-${year}`;
        });

        return res.status(200).json({ data: sumArray });
      } else {
        return res
          .status(401)
          .json({ message: "Falha na autenticação: Token inválido." });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: `Erro ao retornar os dados: ${error}` });
    }
  }
  public async dailyGraphicProduct(req: Request, res: Response) {
    try {
      const clientToken = req.headers.authorization;
      if (!clientToken) {
        return res.status(401).json({ message: "Token não fornecido." });
      }
      const {
        week_day,
        variable_type,
      }: { week_day: string; variable_type: string } = req.body;
      const expectedToken = process.env.TOKEN;
      if (clientToken == `Bearer ${expectedToken}`) {
        //Fuso Horário
        const timezone = "America/Sao_Paulo";

        //Data atual com ano e mês
        const actualdate = moment().tz(timezone).format("YYYY-MM");
        const actualYear = parseInt(actualdate.split("-")[0]);
        const actualMonth = parseInt(actualdate.split("-")[1]);

        //Primeiro e último dia do mês
        const firstDayweek = moment.tz(timezone).startOf("month");
        const lastDayweek = moment.tz(timezone).endOf("month");

        // Agregar os dias da semana
        const daysOfWeek: { [key: string]: string[] } = {};
        let currentDay = firstDayweek.clone();

        while (
          currentDay.isBefore(lastDayweek) ||
          currentDay.isSame(lastDayweek)
        ) {
          const dayOfWeek = currentDay.format("dddd");
          const formattedDate = currentDay.format("YYYY-MM-DD");

          if (!daysOfWeek[dayOfWeek]) {
            daysOfWeek[dayOfWeek] = [];
          }

          daysOfWeek[dayOfWeek].push(formattedDate);
          currentDay.add(1, "day");
        }
        let dateRanges;
        for (let week in daysOfWeek) {
          if (week_day == week) {
            dateRanges = daysOfWeek[week];
          }
        }

        const multiplesInterval: any = dateRanges?.map((element) => {
          return {
            dtHr: {
              gte: `${element}T00:00:00.000Z`,
              lte: `${element}T23:59:59.999Z`,
            },
          };
        });

        const fuelliterageSell = await prismaSales.vendas.findMany({
          select: {
            items: {
              select: {
                iTip: true,
                tot: true,
                qd: true,
                pC: true,
              },
            },
            dtHr: true,
          },
          where: {
            OR: multiplesInterval,
          },
        });

        let dateSeparation: any = {};
        dateRanges?.forEach((element) => {
          dateSeparation[element] = [];
        });
        fuelliterageSell.forEach((element) => {
          const date = new Date(element.dtHr).toISOString().split("T")[0];
          dateSeparation[date].push(...element.items);
        });
        interface DateSum {
          date: string;
          sum: number;
        }
        let sumArray: DateSum[] = [];

        for (const date in dateSeparation) {
          if (dateSeparation.hasOwnProperty(date)) {
            const itemsArray = dateSeparation[date];

            if (itemsArray.length == 0) {
              sumArray.push({ date: date, sum: 0 });
              continue;
            }
            let total = 0;
            let quantity = 0;

            const sum = itemsArray.reduce(
              (accumulate: any, initialValue: any) => {
                if (initialValue.iTip == "0") {
                  const value = parseFloat(initialValue.tot);
                  const quantityValue = parseFloat(initialValue.qd);
                  const cost = parseFloat(initialValue.pC);

                  if (variable_type == "invoicing") {
                    return Math.round((accumulate + value) * 100) / 100;
                  } else if (variable_type == "volume_sold") {
                    return Math.round((accumulate + quantityValue) * 100) / 100;
                  } else if (variable_type == "cost") {
                    return (
                      Math.round((accumulate + quantityValue * cost) * 100) /
                      100
                    );
                  } else if (variable_type == "fuel_margin") {
                    total += value;
                    quantity += quantityValue;
                    return Math.round((total / quantity) * 100) / 100;
                  }
                }
                return accumulate;
              },
              0
            );

            sumArray.push({ date: date, sum: sum });
          }
        }
        sumArray.forEach((element) => {
          const [year, month, day] = element.date.split("-");
          element.date = `${day}-${month}-${year}`;
        });

        return res.status(200).json({ data: sumArray });
      } else {
        return res
          .status(401)
          .json({ message: "Falha na autenticação: Token inválido." });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: `Erro ao retornar os dados: ${error}` });
    }
  }
  public async regionalChart(req: Request, res: Response) {
    try {
      const clientToken = req.headers.authorization;
      if (!clientToken) {
        return res.status(401).json({ message: "Token não fornecido." });
      }

      const { variable_type }: { variable_type: string } = req.body;
      const expectedToken = process.env.TOKEN;
      if (clientToken !== `Bearer ${expectedToken}`) {
        return res
          .status(401)
          .json({ message: "Falha na autenticação: Token inválido." });
      }

      const timezone = "America/Sao_Paulo";
      const firstDay = moment.tz(timezone).startOf("month").toDate();
      const lastDay = moment.tz(timezone).endOf("month").toDate();
      const today = moment.tz(timezone).format("YYYY-MM-DD");
      // Pré-processar o mapeamento regional
      const ibmToRegionMap: { [key: string]: string } = {};
      for (const [region, ibms] of Object.entries(regionStation)) {
        for (const ibm of ibms) {
          ibmToRegionMap[ibm] = region;
        }
      }

      const result = await prismaSales.vendas.findMany({
        select: {
          items: {
            select: {
              iTip: true,
              tot: true,
              qd: true,
              pC: true,
            },
          },
          ibm: true,
        },
        where: {
          dtHr: {
            gte: `${today}T00:00:00.000Z`,
            lte: `${today}T23:59:59.999Z`,
          },
        },
      });

      type RegionalTotals = {
        [key: string]: number;
      };

      const regionalTotals: RegionalTotals = {};
      const regionalQuantities: RegionalTotals = {};

      for (const entry of result) {
        const regionalName = ibmToRegionMap[entry.ibm];
        if (regionalName) {
          if (!regionalTotals[regionalName]) {
            regionalTotals[regionalName] = 0;
            regionalQuantities[regionalName] = 0;
          }

          for (const item of entry.items) {
            if (item.iTip === "1") {
              const tot = parseFloat(item.tot) || 0;
              const qd = parseFloat(item.qd) || 0;
              const pC = parseFloat(item.pC) || 0;

              switch (variable_type) {
                case "invoicing":
                  regionalTotals[regionalName] += tot;
                  break;
                case "volume_sold":
                  regionalTotals[regionalName] += qd;
                  break;
                case "cost":
                  regionalTotals[regionalName] += pC;
                  break;
                case "fuel_margin":
                  regionalTotals[regionalName] += tot;
                  regionalQuantities[regionalName] += qd;
                  break;
              }
            }
          }
        }
      }

      if (variable_type === "fuel_margin") {
        for (const region in regionalTotals) {
          if (regionalQuantities[region] > 0) {
            regionalTotals[region] =
              regionalTotals[region] / regionalQuantities[region];
          } else {
            regionalTotals[region] = 0;
          }
        }
      }

      const finalRegionalTotals: { [key: string]: number } = {};
      for (const region in regionalTotals) {
        finalRegionalTotals[region] =
          Math.round(regionalTotals[region] * 100) / 100;
      }

      const orderRegional = {
        "Regional 1": finalRegionalTotals["REGIONAL1"],
        "Regional 2": finalRegionalTotals["REGIONAL2"],
        "Regional 3": finalRegionalTotals["REGIONAL3"],
        "Regional 4": finalRegionalTotals["REGIONAL4"],
        "Regional 5": finalRegionalTotals["REGIONAL5"],
        "Regional Itaúna": finalRegionalTotals["REGIONALITAUNA"],
      };

      return res.json(orderRegional);
    } catch (error) {
      return res
        .status(500)
        .json({ message: `Erro ao retornar os dados: ${error}` });
    }
  }
  public async regionalChartFuel(req: Request, res: Response) {
    try {
      const clientToken = req.headers.authorization;
      if (!clientToken) {
        return res.status(401).json({ message: "Token não fornecido." });
      }

      const { variable_type }: { variable_type: string } = req.body;
      const expectedToken = process.env.TOKEN;
      if (clientToken !== `Bearer ${expectedToken}`) {
        return res
          .status(401)
          .json({ message: "Falha na autenticação: Token inválido." });
      }

      const timezone = "America/Sao_Paulo";
      const firstDay = moment.tz(timezone).startOf("month").toDate();
      const lastDay = moment.tz(timezone).endOf("month").toDate();
      const today = moment.tz(timezone).format("YYYY-MM-DD");
      // Pré-processar o mapeamento regional
      const ibmToRegionMap: { [key: string]: string } = {};
      for (const [region, ibms] of Object.entries(regionStation)) {
        for (const ibm of ibms) {
          ibmToRegionMap[ibm] = region;
        }
      }

      const result = await prismaSales.vendas.findMany({
        select: {
          items: true,
          ibm: true,
        },
        where: {
          dtHr: {
            gte: `${today}T00:00:00.000Z`,
            lte: `${today}T23:59:59.999Z`,
          },
        },
      });

      type RegionalTotals = {
        [key: string]: number;
      };

      const regionalTotals: RegionalTotals = {};
      const regionalQuantities: RegionalTotals = {};

      for (const entry of result) {
        const regionalName = ibmToRegionMap[entry.ibm];
        if (regionalName) {
          if (!regionalTotals[regionalName]) {
            regionalTotals[regionalName] = 0;
            regionalQuantities[regionalName] = 0;
          }

          for (const item of entry.items) {
            if (item.iTip === "1") {
              const tot = parseFloat(item.tot) || 0;
              const qd = parseFloat(item.qd) || 0;
              const pC = parseFloat(item.pC) || 0;

              switch (variable_type) {
                case "invoicing":
                  regionalTotals[regionalName] += tot;
                  break;
                case "volume_sold":
                  regionalTotals[regionalName] += qd;
                  break;
                case "cost":
                  regionalTotals[regionalName] += pC;
                  break;
                case "fuel_margin":
                  regionalTotals[regionalName] += tot;
                  regionalQuantities[regionalName] += qd;
                  break;
              }
            }
          }
        }
      }

      if (variable_type === "fuel_margin") {
        for (const region in regionalTotals) {
          if (regionalQuantities[region] > 0) {
            regionalTotals[region] =
              regionalTotals[region] / regionalQuantities[region];
          } else {
            regionalTotals[region] = 0;
          }
        }
      }

      const finalRegionalTotals: { [key: string]: number } = {};
      for (const region in regionalTotals) {
        finalRegionalTotals[region] =
          Math.round(regionalTotals[region] * 100) / 100;
      }

      const orderRegional = {
        "Regional 1": finalRegionalTotals["REGIONAL1"],
        "Regional 2": finalRegionalTotals["REGIONAL2"],
        "Regional 3": finalRegionalTotals["REGIONAL3"],
        "Regional 4": finalRegionalTotals["REGIONAL4"],
        "Regional 5": finalRegionalTotals["REGIONAL5"],
        "Regional Itaúna": finalRegionalTotals["REGIONALITAUNA"],
      };

      return res.json(orderRegional);
    } catch (error) {
      return res
        .status(500)
        .json({ message: `Erro ao retornar os dados: ${error}` });
    }
  }
  public async regionalChartProduct(req: Request, res: Response) {
    try {
      const clientToken = req.headers.authorization;

      if (!clientToken) {
        return res.status(401).json({ message: "Token não fornecido." });
      }

      const { variable_type }: { variable_type: string } = req.body;
      const expectedToken = process.env.TOKEN;
      if (clientToken !== `Bearer ${expectedToken}`) {
        return res
          .status(401)
          .json({ message: "Falha na autenticação: Token inválido." });
      }

      const timezone = "America/Sao_Paulo";
      const firstDay = moment.tz(timezone).startOf("month").toDate();
      const lastDay = moment.tz(timezone).endOf("month").toDate();
      const today = moment.tz(timezone).format("YYYY-MM-DD");
      // Pré-processar o mapeamento regional
      const ibmToRegionMap: { [key: string]: string } = {};
      for (const [region, ibms] of Object.entries(regionStation)) {
        for (const ibm of ibms) {
          ibmToRegionMap[ibm] = region;
        }
      }

      const result = await prismaSales.vendas.findMany({
        select: {
          items: true,
          ibm: true,
        },
        where: {
          dtHr: {
            gte: `${today}T00:00:00.000Z`,
            lte: `${today}T23:59:59.999Z`,
          },
        },
      });

      type RegionalTotals = {
        [key: string]: number;
      };

      const regionalTotals: RegionalTotals = {};
      const regionalQuantities: RegionalTotals = {};

      for (const entry of result) {
        const regionalName = ibmToRegionMap[entry.ibm];
        if (regionalName) {
          if (!regionalTotals[regionalName]) {
            regionalTotals[regionalName] = 0;
            regionalQuantities[regionalName] = 0;
          }

          for (const item of entry.items) {
            if (item.iTip === "0") {
              const tot = parseFloat(item.tot) || 0;
              const qd = parseFloat(item.qd) || 0;
              const pC = parseFloat(item.pC) || 0;

              switch (variable_type) {
                case "invoicing":
                  regionalTotals[regionalName] += tot;
                  break;
                case "volume_sold":
                  regionalTotals[regionalName] += qd;
                  break;
                case "cost":
                  regionalTotals[regionalName] += pC;
                  break;
                case "fuel_margin":
                  regionalTotals[regionalName] += tot;
                  regionalQuantities[regionalName] += qd;
                  break;
              }
            }
          }
        }
      }

      if (variable_type === "fuel_margin") {
        for (const region in regionalTotals) {
          if (regionalQuantities[region] > 0) {
            regionalTotals[region] =
              regionalTotals[region] / regionalQuantities[region];
          } else {
            regionalTotals[region] = 0;
          }
        }
      }

      const finalRegionalTotals: { [key: string]: number } = {};
      for (const region in regionalTotals) {
        finalRegionalTotals[region] =
          Math.round(regionalTotals[region] * 100) / 100;
      }

      const orderRegional = {
        "Regional 1": finalRegionalTotals["REGIONAL1"],
        "Regional 2": finalRegionalTotals["REGIONAL2"],
        "Regional 3": finalRegionalTotals["REGIONAL3"],
        "Regional 4": finalRegionalTotals["REGIONAL4"],
        "Regional 5": finalRegionalTotals["REGIONAL5"],
        "Regional Itaúna": finalRegionalTotals["REGIONALITAUNA"],
      };

      return res.json(orderRegional);
    } catch (error) {
      return res
        .status(500)
        .json({ message: `Erro ao retornar os dados: ${error}` });
    }
  }
  public async mapData(req: Request, res: Response) {
    try {
      const clientToken = req.headers.authorization;
      const { use_token }: any = req.params;
      if (!clientToken) {
        return res.status(401).json({ message: "Token não fornecido." });
      }
      const secret = process.env.SECRET;
      if (!secret) {
        throw new Error(
          "Chave secreta não definida. Verifique a variável de ambiente SECRET."
        );
      }
      const id_token = extractUserIdFromToken(use_token, secret);
      if (!id_token) {
        return res
          .status(400)
          .json({ message: "Token de usuário inválido ou não fornecido." });
      }
      const expectedToken = process.env.TOKEN;
      if (clientToken == `Bearer ${expectedToken}`) {
        const today = moment.tz("America/Sao_Paulo").format("YYYY-MM-DD");
        const marginsDefined =
          await prismaRedeFlex.gas_station_setvariables.findMany({
            select: {
              gas_station_TMF_modal: true,
              gas_station_LUCRO_BRUTO_OPERACIONAL_modal: true,
              gas_station_LUCRO_BRUTO_GALONAGEM_modal: true,
              gas_station_LUCRO_BRUTO_PRODUTO_modal: true,
              gas_station_TMC_modal: true,
              gas_station_TMP_modal: true,
              gas_station_TMVOL_modal: true,
              gas_station_MLT_modal: true,
              ibm_info_id: true,
              ibm_info: { select: { ibm: true, nomefantasia: true } },
            },
            where: { use_uuid: id_token },
          });

        const ibmsStations = await prismaRedeFlex.ibm_info.findMany({
          select: { razaosocial: true, ibm: true, id: true },
        });
        const result = await prismaSales.vendas.findMany({
          select: {
            ibm: true,
            items: {
              select: {
                iTip: true,
                tot: true,
                qd: true,
                pC: true,
              },
            },
          },
          where: {
            dtHr: {
              gte: `${today}T00:00:00.000Z`,
              lte: `${today}T23:59:59.999Z`,
            },
          },
        });
        //Fluxo para calcular média M/LT
        const itemsArray = result.flatMap((element) => {
          return element.items;
        });

        const supplyQuantity = itemsArray.flatMap((element) => {
          return element;
        });
        const fuel = itemsArray
          .map((element) => {
            if (element.iTip == "1") {
              return parseFloat(element.tot);
            }
            return undefined;
          })
          .filter((item): item is number => item !== undefined);

        const sumFuel = fuel.reduce((accumulator, currentValue) => {
          return (accumulator || 0) + (currentValue || 0);
        }, 0);
        const cost_price = itemsArray
          .map((element) => {
            if (element.iTip === "1") {
              return { pc: parseFloat(element.pC), qd: parseFloat(element.qd) };
            }
            return undefined;
          })
          .filter(
            (item): item is { pc: number; qd: number } => item !== undefined
          );

        const sumCostPrice = cost_price.reduce((accumulator, currentValue) => {
          return (accumulator || 0) + (currentValue.qd * currentValue.pc || 0);
        }, 0);
        const literage = itemsArray
          .map((element) => {
            if (element.iTip == "1") {
              return parseFloat(element.qd);
            }
            return undefined;
          })
          .filter((item): item is number => item !== undefined);

        const sumLiterage = literage.reduce((accumulator, currentValue) => {
          return (accumulator || 0) + (currentValue || 0);
        }, 0);
        const fuelProfit = Math.round((sumFuel - sumCostPrice) * 100) / 100;
        const valueMLT = sumLiterage !== 0 ? fuelProfit / sumLiterage : 0;
        const averageMLT = Math.round(valueMLT * 100) / 100;
        //Fim

        // const quantSupply = supplyQuantity.length

        //Agregando por IBM
        let station: { [key: string]: Object[] } = {};
        result.forEach((element) => {
          if (!station[element.ibm]) {
            station[element.ibm] = [];
          }
          station[element.ibm].push(...element.items);
        });

        type ItemType = {
          ibm: string;
          "M/LT": number;
          TMC: number;
          "TM VOL": number;
          TMP: number;
          TMF: number;
          LBO: number;
          LBOProduto: number;
          LBOGalonagem: number;
          tmf_comparisson: number;
          lucro_bruto_operacional_comparisson: number;
          lucro_bruto_operacional: number;
          lucro_bruto_operacional_produto: number;
          lucro_bruto_operacional_galonagem: number;
          tmc_comparisson: number;
          tmp_comparisson: number;
          tmvol_comparisson: number;
          mlt_comparisson: number;
          averageComparison: number;
        };

        let ibmvalues: ItemType[] = [];
        for (let ibm in station) {
          let itemsArray = station[ibm];
          const quantSupply = itemsArray.length;
          const sumfuel = itemsArray.reduce(
            (accumulate: number, initialValue: any) => {
              if (initialValue.iTip == "1") {
                const value = parseFloat(initialValue.tot);
                return accumulate + value;
              }
              return accumulate;
            },
            0
          );
          const literage = itemsArray.reduce(
            (accumulate: number, initialValue: any) => {
              if (initialValue.iTip == "1") {
                const value = parseFloat(initialValue.qd);
                return accumulate + value;
              }
              return accumulate;
            },
            0
          );
          const sumproduct = itemsArray.reduce(
            (accumulate: number, initialValue: any) => {
              if (initialValue.iTip == "0") {
                const value = parseFloat(initialValue.tot);
                return accumulate + value;
              }
              return accumulate;
            },
            0
          );
          const sumCostPrice = itemsArray.reduce(
            (accumulate: number, initialValue: any) => {
              if (initialValue.iTip == "1") {
                return (
                  (accumulate || 0) + (initialValue.qd * initialValue.pC || 0)
                );
              }
              return accumulate;
            },
            0
          );
          const sumProductPrice = itemsArray.reduce(
            (accumulate: number, initialValue: any) => {
              if (initialValue.iTip == "0") {
                return (
                  (accumulate || 0) + (initialValue.qd * initialValue.pC || 0)
                );
              }
              return accumulate;
            },
            0
          );

          const roundedSum = Math.round(sumfuel * 100) / 100;
          const roundedProduct = Math.round(sumproduct * 100) / 100;
          const roundedLiterage = Math.round(literage * 100) / 100;
          //M/LT
          const valueMLT =
            literage !== 0 ? (sumfuel - sumCostPrice) / literage : 0;
          //TMC
          const valueTMC = quantSupply !== 0 ? sumCostPrice / quantSupply : 0;
          //TM VOL
          const valueTMVOL = quantSupply !== 0 ? literage / quantSupply : 0;
          //TMP
          const valueTMP =
            quantSupply !== 0 ? sumProductPrice / quantSupply : 0;
          //TMF
          const valueTMF =
            quantSupply !== 0 ? (sumproduct + sumfuel) / quantSupply : 0;
          //LBO's calculadas
          const valueLBO =
            sumproduct - sumProductPrice !== 0
              ? (sumfuel - sumCostPrice + (sumproduct - sumProductPrice)) /
              (sumproduct + sumfuel)
              : 0;
          const valueLBOProduto =
            sumproduct !== 0 ? (sumproduct - sumProductPrice) / sumproduct : 0;
          const valueLBOGalonagem =
            sumfuel !== 0 ? (sumfuel - sumCostPrice) / sumfuel : 0;
          // const averageReturn = (valueMLT < averageMLT) ? true : false

          // "Venda de Combustível": roundedSum, "Produtos vendidos": roundedProduct, "Galonagem": roundedLiterage,
          ibmvalues.push({
            ibm: ibm,
            "M/LT": Math.round(valueMLT * 100) / 100,
            TMC: Math.round(valueTMC * 100) / 100,
            "TM VOL": Math.round(valueTMVOL * 100) / 100,
            TMP: Math.round(valueTMP * 100) / 100,
            TMF: Math.round(valueTMF * 100) / 100,
            LBO: Math.round(valueLBO * 100) / 100,
            LBOProduto: Math.round(valueLBOProduto * 100) / 100,
            averageComparison: 0,
            LBOGalonagem: Math.round(valueLBOGalonagem * 100) / 100,
            tmc_comparisson: 0,
            tmf_comparisson: 0,
            tmp_comparisson: 0,
            tmvol_comparisson: 0,
            mlt_comparisson: 0,
            lucro_bruto_operacional_comparisson: 0,
            lucro_bruto_operacional: 0,
            lucro_bruto_operacional_produto: 0,
            lucro_bruto_operacional_galonagem: 0,
          });
        }

        marginsDefined.forEach((ibmNumber) => {
          ibmvalues.forEach((item) => {
            if (ibmNumber.ibm_info?.ibm === item.ibm) {
              item.tmc_comparisson = ibmNumber.gas_station_TMC_modal || 0;
              item.tmf_comparisson = ibmNumber.gas_station_TMF_modal || 0;
              item.tmp_comparisson = ibmNumber.gas_station_TMP_modal || 0;
              item.tmvol_comparisson = ibmNumber.gas_station_TMVOL_modal || 0;
              item.mlt_comparisson = ibmNumber.gas_station_MLT_modal || 0;
              item.lucro_bruto_operacional_comparisson =
                ibmNumber.gas_station_LUCRO_BRUTO_OPERACIONAL_modal || 0;
              //Os 3 debaixos sao os lbos definidos
              item.lucro_bruto_operacional =
                ibmNumber.gas_station_LUCRO_BRUTO_OPERACIONAL_modal || 0;
              item.lucro_bruto_operacional_galonagem =
                ibmNumber.gas_station_LUCRO_BRUTO_GALONAGEM_modal || 0;
              item.lucro_bruto_operacional_produto =
                ibmNumber.gas_station_LUCRO_BRUTO_PRODUTO_modal || 0;
            }
          });
        });

        const ibmvaluesMap = ibmvalues.map((element) => {
          if (
            element.LBO >= element.lucro_bruto_operacional_comparisson &&
            element["M/LT"] >= element.mlt_comparisson &&
            element["TM VOL"] >= element.tmvol_comparisson &&
            element.TMC >= element.tmc_comparisson &&
            element.TMF >= element.tmf_comparisson &&
            element.TMP >= element.tmp_comparisson
          ) {
            element.averageComparison = 0;
          } else if (
            (element["M/LT"] < element.mlt_comparisson ||
              element["TM VOL"] < element.tmvol_comparisson ||
              element.TMC < element.tmc_comparisson ||
              element.TMF < element.tmf_comparisson ||
              element.TMP < element.tmp_comparisson) &&
            element.LBO >= element.lucro_bruto_operacional_comparisson
          ) {
            element.averageComparison = 1;
          } else if (
            element.LBO < element.lucro_bruto_operacional_comparisson
          ) {
            element.averageComparison = 2;
          }
          return {
            ibm: element.ibm,
            "M/LT": element["M/LT"],
            TMC: element.TMC,
            "TM VOL": element["TM VOL"],
            TMP: element.TMP,
            TMF: element.TMF,
            "M/LT_Definido": element.mlt_comparisson,
            TMC_Definido: element.tmc_comparisson,
            "TM VOL_Definido": element.tmvol_comparisson,
            TMP_Definido: element.tmp_comparisson,
            TMF_Definido: element.tmf_comparisson,
            LBO: Math.round(element.LBO * 100 * 100) / 100,
            LBOProduto: Math.round(element.LBOProduto * 100 * 100) / 100,
            LBOGalonagem: Math.round(element.LBOGalonagem * 100 * 100) / 100,
            LBO_Definido: element.lucro_bruto_operacional * 100,
            LBO_Produto_Definido: element.lucro_bruto_operacional_produto * 100,
            LBO_Galonagem_Definido:
              element.lucro_bruto_operacional_galonagem * 100,
            averageComparison: element.averageComparison,
          };
        });

        return res.status(200).json({ data: ibmvaluesMap });
      } else {
        return res
          .status(401)
          .json({ message: "Falha na autenticação: Token inválido." });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: `Erro ao retornar os dados: ${error}` });
    }
  }
  public async fuelTypes(req: Request, res: Response) {
    try {
      const data = await prismaLBCBi.combustiveis.findMany({
        select: { des: true },
      });

      const uniqueData = [...new Set(data.map((item) => item.des))];

      return res.status(200).json({ data: uniqueData });
    } catch (error) {
      return res
        .status(500)
        .json({ message: `Erro ao retornar os dados: ${error}` });
    }
  }
  //Gráfico por cada posto quando usuário clica em uma determinada região(combustível)
  public async regionalStateDataFrame(req: Request, res: Response) {
    try {
      const clientToken = req.headers.authorization;
      const { filter } = req.params;
      const tip = filter === "0" ? "0" : "1";

      if (!clientToken) {
        return res.status(401).json({ message: "Token não fornecido." });
      }

      const {
        variable_type,
        regional_type,
      }: { variable_type: string; regional_type: keyof typeof regionStation } =
        req.body;
      const expectedToken = process.env.TOKEN;

      if (clientToken !== `Bearer ${expectedToken}`) {
        return res
          .status(401)
          .json({ message: "Falha na autenticação: Token inválido." });
      }

      const ibmsInRegional = regionStation[regional_type];
      if (!ibmsInRegional) {
        return res
          .status(400)
          .json({ message: `Regional inválida: ${regional_type}` });
      }

      const timezone = "America/Sao_Paulo";
      const today = moment.tz(timezone).format("YYYY-MM-DD");

      const [salesData, ibmNames] = await Promise.all([
        prismaSales.vendas.findMany({
          select: {
            items: {
              select: {
                iTip: true,
                tot: true,
                qd: true,
                pC: true,
              },
            },
            ibm: true,
          },
          where: {
            ibm: { in: ibmsInRegional },
            dtHr: {
              gte: `${today}T00:00:00.000Z`,
              lte: `${today}T23:59:59.999Z`,
            },
          },
        }),
        prismaRedeFlex.ibm_info.findMany({
          select: { ibm: true, nomefantasia: true },
          where: { ibm: { in: ibmsInRegional } },
        }),
      ]);

      const ibmNameMap = ibmNames.reduce((map, { ibm, nomefantasia }) => {
        if (ibm) {
          map[ibm] = nomefantasia || ibm;
        }
        return map;
      }, {} as { [ibm: string]: string });

      // Agrega os valores conforme o tipo de variável
      const ibmTotals: { [ibm: string]: number } = {};
      const ibmQuantities: { [ibm: string]: number } = {};

      salesData.forEach(({ ibm, items }) => {
        if (ibm) {
          if (!ibmTotals[ibm]) {
            ibmTotals[ibm] = 0;
            ibmQuantities[ibm] = 0;
          }

          items.forEach(({ iTip, tot, qd, pC }) => {
            if (iTip === tip) {
              const totalValue = parseFloat(tot) || 0;
              const quantityValue = parseFloat(qd) || 0;
              const costValue = parseFloat(pC) || 0;

              switch (variable_type) {
                case "invoicing":
                  ibmTotals[ibm] += totalValue;
                  break;
                case "volume_sold":
                  ibmTotals[ibm] += quantityValue;
                  break;
                case "cost":
                  ibmTotals[ibm] += costValue;
                  break;
                case "fuel_margin":
                  ibmTotals[ibm] += totalValue;
                  ibmQuantities[ibm] += quantityValue;
                  break;
              }
            }
          });
        }
      });

      if (variable_type === "fuel_margin") {
        for (const ibm in ibmTotals) {
          if (ibmQuantities[ibm] > 0) {
            ibmTotals[ibm] = ibmTotals[ibm] / ibmQuantities[ibm];
          } else {
            ibmTotals[ibm] = 0;
          }
        }
      }

      const resultObject = Object.entries(ibmTotals).reduce(
        (acc, [ibm, total]) => {
          const formattedIbm = ibmNameMap[ibm];
          acc[formattedIbm] = Math.round(total * 100) / 100;
          return acc;
        },
        {} as { [key: string]: number }
      );

      return res.json(resultObject);
    } catch (error) {
      return res
        .status(500)
        .json({ message: `Erro ao retornar os dados: ${error}` });
    }
  }
  //Gráfico por cada posto(de um dia do mês) quando usuário clica em um determinado dia
  public async regionalStateDailyDataFrame(req: Request, res: Response) {
    try {
      const clientToken = req.headers.authorization;
      const { filter } = req.params;
      const tip = filter === "0" ? "0" : "1";
      const {
        variable_type,
        week_day,
      }: { variable_type: string; week_day: string } = req.body;

      if (!clientToken)
        return res.status(401).json({ message: "Token não fornecido." });

      const expectedToken = process.env.TOKEN;
      if (clientToken !== `Bearer ${expectedToken}`) {
        return res
          .status(401)
          .json({ message: "Falha na autenticação: Token inválido." });
      }

      const [dayISO, monthISO, yearISO] = week_day.split("-");
      const dateISO = `${yearISO}-${monthISO}-${dayISO}`;

      const [vendasResult, ibmNames] = await Promise.all([
        prismaSales.vendas.findMany({
          select: {
            items: {
              select: {
                iTip: true,
                tot: true,
                qd: true,
                pC: true,
              },
            },
            ibm: true,
          },
          where: {
            dtHr: {
              gte: `${dateISO}T00:00:00.000Z`,
              lte: `${dateISO}T23:59:59.999Z`,
            },
          },
        }),
        prismaRedeFlex.ibm_info.findMany({
          select: { ibm: true, nomefantasia: true },
        }),
      ]);

      const ibmObject = vendasResult.reduce((acc, element) => {
        if (!acc[element.ibm]) acc[element.ibm] = [];
        acc[element.ibm] = acc[element.ibm].concat(element.items);
        return acc;
      }, {} as { [key: string]: any[] });

      let total = 0,
        quantity = 0;
      const arrayIbm = Object.entries(ibmObject).map(([ibm, items]) => {
        const sum = items.reduce((acc, item) => {
          if (item.iTip === tip) {
            const value = parseFloat(item.tot);
            const quantityValue = parseFloat(item.qd);
            const cost = parseFloat(item.pC);

            switch (variable_type) {
              case "invoicing":
                return Math.round((acc + value) * 100) / 100;
              case "volume_sold":
                return Math.round((acc + quantityValue) * 100) / 100;
              case "cost":
                return Math.round((acc + quantityValue * cost) * 100) / 100;
              case "fuel_margin":
                total += value;
                quantity += quantityValue;
                return Math.round((total / quantity) * 100) / 100;
            }
          }
          return acc;
        }, 0);
        return { ibm, sum };
      });

      const objectIbm = arrayIbm.reduce((acc, { ibm, sum }) => {
        const ibmInfo = ibmNames.find((info) => info.ibm === ibm);
        const ibmName = ibmInfo?.nomefantasia ?? ibm;
        acc[ibmName] = sum;
        return acc;
      }, {} as { [key: string]: number });

      return res.json(objectIbm);
    } catch (error) {
      return res
        .status(500)
        .json({ message: `Erro ao retornar os dados: ${error}` });
    }
  }

  //Gráfico por cada posto quando usuário clica em uma determinada região(produto)
  public async regionalStateDataFrameProduct(req: Request, res: Response) {
    try {
      const clientToken = req.headers.authorization;
      if (!clientToken) {
        return res.status(401).json({ message: "Token não fornecido." });
      }

      const {
        variable_type,
        regional_type,
      }: { variable_type: string; regional_type: keyof typeof regionStation } =
        req.body;
      const expectedToken = process.env.TOKEN;
      if (clientToken !== `Bearer ${expectedToken}`) {
        return res
          .status(401)
          .json({ message: "Falha na autenticação: Token inválido." });
      }

      const ibmsInRegional = regionStation[regional_type];
      if (!ibmsInRegional) {
        return res
          .status(400)
          .json({ message: `Regional inválida: ${regional_type}` });
      }

      const timezone = "America/Sao_Paulo";
      const today = moment.tz(timezone).format("YYYY-MM-DD");

      const result = await prismaSales.vendas.findMany({
        select: {
          items: true,
          ibm: true,
        },
        where: {
          ibm: { in: ibmsInRegional }, // Filtrar apenas os IBMs da regional solicitada
          dtHr: {
            gte: `${today}T00:00:00.000Z`,
            lte: `${today}T23:59:59.999Z`,
          },
        },
      });

      type IBMTotals = {
        [key: string]: number;
      };

      const ibmTotals: IBMTotals = {};
      const ibmQuantities: IBMTotals = {};

      for (const entry of result) {
        const ibm = entry.ibm;
        if (!ibmTotals[ibm]) {
          ibmTotals[ibm] = 0;
          ibmQuantities[ibm] = 0;
        }

        for (const item of entry.items) {
          if (item.iTip === "0") {
            const tot = parseFloat(item.tot) || 0;
            const qd = parseFloat(item.qd) || 0;
            const pC = parseFloat(item.pC) || 0;

            switch (variable_type) {
              case "invoicing":
                ibmTotals[ibm] += tot;
                break;
              case "volume_sold":
                ibmTotals[ibm] += qd;
                break;
              case "cost":
                ibmTotals[ibm] += pC;
                break;
              case "fuel_margin":
                ibmTotals[ibm] += tot;
                ibmQuantities[ibm] += qd;
                break;
            }
          }
        }
      }

      if (variable_type === "fuel_margin") {
        for (const ibm in ibmTotals) {
          if (ibmQuantities[ibm] > 0) {
            ibmTotals[ibm] = ibmTotals[ibm] / ibmQuantities[ibm];
          } else {
            ibmTotals[ibm] = 0;
          }
        }
      }

      const finalIbmTotals: { [key: string]: number } = {};
      for (const ibm in ibmTotals) {
        finalIbmTotals[ibm] = Math.round(ibmTotals[ibm] * 100) / 100;
      }

      const finalIbmTotalsArray = Object.entries(finalIbmTotals).map(
        ([ibm, total]) => ({
          ibm,
          total,
        })
      );

      const returnIbmName = await Promise.all(
        finalIbmTotalsArray.map(async (element) => {
          const value = await prismaRedeFlex.ibm_info.findFirst({
            select: { nomefantasia: true },
            where: { ibm: element.ibm },
          });
          element.ibm = value?.nomefantasia || element.ibm;
          return element;
        })
      );

      const resultObject = returnIbmName.reduce((acc, element) => {
        acc[element.ibm] = element.total;
        return acc;
      }, {} as { [key: string]: number });

      return res.json(resultObject);
    } catch (error) {
      return res
        .status(500)
        .json({ message: `Erro ao retornar os dados: ${error}` });
    }
  }
  public async BigNumbersMonth(req?: Request, res?: Response) {
    try {
      const actualdate = moment().tz("America/Sao_Paulo").format("YYYY-MM-DD");
      const firstDayOfMonth = moment()
        .tz("America/Sao_Paulo")
        .startOf("month")
        .format("YYYY-MM-DD");

      const fuelliterageSell = await prismaSales.vendas.findMany({
        select: {
          items: {
            select: {
              iTip: true,
              tot: true,
              qd: true,
              pC: true,
            },
          },
          ibm: true,
        },
        where: {
          dtHr: {
            gte: `${firstDayOfMonth}T00:00:00.000Z`,
            lte: `${actualdate}T23:59:59.999Z`,
          },
        },
      });
      //API Saulo
      const monthProduct = await axios.get(
        `${process.env.NEXT_PUBLIC_DATAFRAME_EXTERN_API}/dataframes_month`
      );
      //Construção array de items
      const itemsArray = fuelliterageSell.flatMap((element) => {
        return element.items;
      });
      //Quantas vezes foi abastecido combustível nos postos
      const supplyQuantity = itemsArray.flatMap((element) => {
        return element;
      });
      //Quantas vezes entraram carros e compraram no posto
      const quantTotal = itemsArray.length;
      const quantSupply = supplyQuantity.length;

      //Soma combustíveis tipo combustivel
      const fuel = itemsArray
        .map((element) => {
          if (element.iTip == "1") {
            return parseFloat(element.tot);
          }
          return undefined;
        })
        .filter((item): item is number => item !== undefined);

      const sumFuel = fuel.reduce((accumulator, currentValue) => {
        return (accumulator || 0) + (currentValue || 0);
      }, 0);

      //Faturamento total combustível+produto
      const fuelTotal = itemsArray
        .map((element) => {
          return parseFloat(element.tot);
        })
        .filter((item): item is number => item !== undefined);

      const sumFuelTotal = fuelTotal.reduce((accumulator, currentValue) => {
        return (accumulator || 0) + (currentValue || 0);
      }, 0);

      //Soma da litragem tipo combustível
      const literage = itemsArray
        .map((element) => {
          if (element.iTip == "1") {
            return parseFloat(element.qd);
          }
          return undefined;
        })
        .filter((item): item is number => item !== undefined);

      //Carros que entraram no posto
      const supply = itemsArray.map((element) => {
        return parseFloat(element.qd);
      }, 0);
      const sumSupply = supply.reduce((accumulator, currentValue) => {
        return (accumulator || 0) + (currentValue || 0);
      }, 0);
      const sumLiterage = literage.reduce((accumulator, currentValue) => {
        return (accumulator || 0) + (currentValue || 0);
      }, 0);

      //Soma do preço de custo do combustível
      const cost_price = itemsArray
        .map((element) => {
          if (element.iTip === "1") {
            return { pc: parseFloat(element.pC), qd: parseFloat(element.qd) };
          }
          return undefined;
        })
        .filter(
          (item): item is { pc: number; qd: number } => item !== undefined
        );

      const sumCostPrice = cost_price.reduce((accumulator, currentValue) => {
        return (accumulator || 0) + (currentValue.qd * currentValue.pc || 0);
      }, 0);

      //Soma combustíveis tipo produto
      const fuelProd = itemsArray
        .map((element) => {
          if (element.iTip == "0") {
            return parseFloat(element.tot);
          }
          return undefined;
        })
        .filter((item): item is number => item !== undefined);

      const sumFuelProd = fuelProd.reduce((accumulator, currentValue) => {
        return (accumulator || 0) + (currentValue || 0);
      }, 0);

      //Soma da litragem tipo produto
      const literageProd = itemsArray
        .map((element) => {
          if (element.iTip == "0") {
            return parseFloat(element.qd);
          }
          return undefined;
        })
        .filter((item): item is number => item !== undefined);

      const sumLiterageProd = literageProd.reduce(
        (accumulator, currentValue) => {
          return (accumulator || 0) + (currentValue || 0);
        },
        0
      );
      //Soma do preço de custo do produto
      const product_price = itemsArray
        .map((element) => {
          if (element.iTip === "0") {
            return { pc: parseFloat(element.pC), qd: parseFloat(element.qd) };
          }
          return undefined;
        })
        .filter(
          (item): item is { pc: number; qd: number } => item !== undefined
        );

      const sumProductPrice = product_price.reduce(
        (accumulator, currentValue) => {
          return (accumulator || 0) + (currentValue.pc * currentValue.qd || 0);
        },
        0
      );
      //Diferença faturamento de combustível pelo custo que é o lucro
      const fuelProfit = Math.round((sumFuel - sumCostPrice) * 100) / 100;
      //Diferença faturamento de produto pelo custo que é o lucro
      // const productProfit = Math.round(((sumFuelProd - sumProductPrice)) * 100) / 100

      await prismaRedeFlex.big_numbers_values.update({
        data: {
          bignumbers_fuelProfit: parseFloat(monthProduct.data.month_combs),
          bignumbers_fuelSales: Math.round(sumFuel * 100) / 100,
          bignumbers_invoicing: Math.round(sumFuelTotal * 100) / 100,
          bignumbers_productProfit: parseFloat(monthProduct.data.month_Prod),
          bignumbers_productSales: Math.round(sumFuelProd * 100) / 100,
          bignumbers_sumliterage: Math.round(sumLiterage * 100) / 100,
          bignumbers_Supplies: Math.round(quantSupply * 100) / 100,
        },
        where: { bignumbers_uuid: "650f5af0-b341-4980-aad0-8617e53c41ec" },
      });
      return res
        ?.status(200)
        .json({ message: "Dados atualizados com sucesso!" });
    } catch (error) {
      return res
        ?.status(500)
        .json({ message: `Erro ao atualizar os dados: ${error}` });
    }
  }
  //Atualizar informações de resultado bruto produto e galonagem
  public async profitProductSum(req?: Request, res?: Response) {
    try {
      const token = process.env.SAULOAPI;
      const tableData = await axios.get(
        `${process.env.NEXT_PUBLIC_DATAFRAME_EXTERN_API}/dataframes?token=${token}`
      );
      const users = await prismaRedeFlex.users.findMany({
        select: { use_uuid: true },
      });
      const actualdate =
        moment().tz("America/Sao_Paulo").format("YYYY-MM-DDTHH:mm:ss") + "Z";

      const sumLiterageResult = await tableData.data["galonagem"].reduce(
        (accumulator: number, currentValue: any) => {
          return (accumulator || 0) + (currentValue["Resultado Bruto"] || 0);
        },
        0
      );
      const sumProductResult = await tableData.data["produto"].reduce(
        (accumulator: number, currentValue: any) => {
          return (accumulator || 0) + (currentValue["Resultado Bruto"] || 0);
        },
        0
      );

      //Salvar na tabela dos bignumbers como a soma de produto diario e soma galonagem diária
      await prismaRedeFlex.big_numbers_values.update({
        data: {
          bignumbers_dailyProductProfit:
            Math.round(sumProductResult * 100) / 100,
          bignumbers_dailyLiterageProfit:
            Math.round(sumLiterageResult * 100) / 100,
        },
        where: { bignumbers_uuid: "650f5af0-b341-4980-aad0-8617e53c41ec" },
      });

      await prismaRedeFlex.gallon_gross_last_week.createMany({
        data: users.map((id) => ({
          gallon_last_history_gross: Math.round(sumLiterageResult * 100) / 100,
          gallon_last_history_date: actualdate,
          use_uuid: id.use_uuid,
        })),
      });
      await prismaRedeFlex.product_gross_last_week.createMany({
        data: users.map((id) => ({
          product_last_history_gross: Math.round(sumProductResult * 100) / 100,
          product_last_history_date: actualdate,
          use_uuid: id.use_uuid,
        })),
      });
      return res
        ?.status(200)
        .json({ message: "Dados atualizados com sucesso!" });
    } catch (error) {
      return res
        ?.status(500)
        .json({ message: `Erro ao atualizar os dados: ${error}` });
    }
  }
  //Fluxo de criação registros de resultado bruto produto/galonagem
  public async grossHistory(req?: Request, res?: Response) {
    try {
      const actualDate = moment().format("YYYY-MM-DD");
      const token = process.env.SAULOAPI;
      const tableData = await axios.get(
        `${process.env.NEXT_PUBLIC_DATAFRAME_EXTERN_API}/dataframes?token=${token}`
      );
      //Buscar resultado bruto para galonagem por posto
      const grossLiterage = tableData.data["galonagem"].map((element: any) => {
        return {
          resultado_bruto: element["Resultado Bruto"],
          ibm: element["Posto_ibm"],
          posto: element["Posto"],
        };
      });
      //Buscar resultado bruto para produto por posto
      const grossProduct = tableData.data["produto"].map((element: any) => {
        return {
          resultado_bruto: element["Resultado Bruto"],
          ibm: element["Posto_ibm"],
          posto: element["Posto"],
        };
      });
      //Mapear os ibms para associar com os ids primarios da tabela ibm_info
      const grossLiterageIbm = grossLiterage.map((element: any) => {
        return element.ibm;
      });

      //Mapear id primario com ibm
      const grossLiterageProductId = await prismaRedeFlex.ibm_info.findMany({
        select: { id: true, ibm: true },
        where: {
          ibm: {
            in: grossLiterageIbm,
          },
        },
      });

      //Tratando o array de galonagem que será enviado para o banco(histórico) de galonagem
      const finalgrossLiterageArray = grossLiterageProductId
        .map((obj1: any) => {
          const match = grossLiterage.find(
            (obj2: any) => obj1.ibm === obj2.ibm
          );

          if (match) {
            return {
              ibm_info_id: obj1.id,
              gallon_history_date: new Date(actualDate),
              gallon_history_gross:
                Math.round(match.resultado_bruto * 100) / 100,
              use_uuid: "a9d1c35a-8ead-4687-9661-c15af693c761",
            };
          }
          return null;
        })
        .filter((item) => item !== null);
      //Tratando o array de produto que será enviado para o banco(histórico) de produto
      const finalgrossProductArray = grossLiterageProductId
        .map((obj1: any) => {
          const match = grossProduct.find((obj2: any) => obj1.ibm === obj2.ibm);

          if (match) {
            return {
              ibm_info_id: obj1.id,
              product_history_date: new Date(actualDate),
              product_history_gross:
                Math.round(match.resultado_bruto * 100) / 100,
              use_uuid: "a9d1c35a-8ead-4687-9661-c15af693c761",
            };
          }
          return null;
        })
        .filter((item) => item !== null);

      // Buscar os registros existentes para galonagem
      const existingGallonRecords =
        await prismaRedeFlex.gallon_gross_history.findMany({
          where: {
            gallon_history_date: new Date(actualDate),
            ibm_info_id: {
              in: finalgrossLiterageArray.map((item) => item.ibm_info_id),
            },
          },
          select: { ibm_info_id: true },
        });

      // Filtrar registros de galonagem que precisam ser criados
      const gallonToCreate = finalgrossLiterageArray.filter(
        (item) =>
          !existingGallonRecords.some(
            (record) => record.ibm_info_id === item.ibm_info_id
          )
      );

      // Atualizar registros existentes de galonagem
      for (const record of existingGallonRecords) {
        const match = finalgrossLiterageArray.find(
          (item) => item.ibm_info_id === record.ibm_info_id
        );
        if (match) {
          await prismaRedeFlex.gallon_gross_history.updateMany({
            where: {
              ibm_info_id: match.ibm_info_id,
              gallon_history_date: new Date(actualDate),
            },
            data: { gallon_history_gross: match.gallon_history_gross },
          });
        }
      }

      if (gallonToCreate.length > 0) {
        await prismaRedeFlex.gallon_gross_history.createMany({
          data: gallonToCreate,
        });
      }

      const existingProductRecords =
        await prismaRedeFlex.product_gross_history.findMany({
          where: {
            product_history_date: new Date(actualDate),
            ibm_info_id: {
              in: finalgrossProductArray.map((item) => item.ibm_info_id),
            },
          },
          select: { ibm_info_id: true },
        });

      const productToCreate = finalgrossProductArray.filter(
        (item) =>
          !existingProductRecords.some(
            (record) => record.ibm_info_id === item.ibm_info_id
          )
      );

      for (const record of existingProductRecords) {
        const match = finalgrossProductArray.find(
          (item) => item.ibm_info_id === record.ibm_info_id
        );
        if (match) {
          await prismaRedeFlex.product_gross_history.updateMany({
            where: {
              ibm_info_id: match.ibm_info_id,
              product_history_date: new Date(actualDate),
            },
            data: { product_history_gross: match.product_history_gross },
          });
        }
      }

      if (productToCreate.length > 0) {
        await prismaRedeFlex.product_gross_history.createMany({
          data: productToCreate,
        });
      }

      return res
        ?.status(200)
        .json({ message: "As informações foram salvas com sucesso!" });
    } catch (error) {
      return res
        ?.status(500)
        .json({ message: `Erro ao atualizar os dados: ${error}` });
    }
  }
  //API gráfico agregado de todos os postos resultado bruto diario
  public async grossDailyChart(req: Request, res: Response) {
    try {
      const actualDate = moment().format("YYYY-MM-DD");

      const day = parseFloat(actualDate.split("-")[2]);
      const monthDay = moment().format("YYYY-MM");
      const monthCountDays = moment().daysInMonth();
      const { use_token, type }: any = req.params;

      const secret = process.env.SECRET;
      if (!secret) {
        throw new Error(
          "Chave secreta não definida. Verifique a variável de ambiente SECRET."
        );
      }
      const id = extractUserIdFromToken(use_token, secret);
      let dataGross: any;
      let dataInfo: any;
      let grossDataArray: object[] = [];

      const grossResultDefined =
        await prismaRedeFlex.gas_station_setvariables.findMany({
          select: {
            gas_station_gross_result_literage: true,
            gas_station_gross_result_product: true,
          },
          where: { use_uuid: id },
        });

      //Média do resultado bruto mensal de galonagem definido
      const grossLiterageDefinedSum =
        grossResultDefined.reduce((acc: any, item: any) => {
          return acc + (item.gas_station_gross_result_literage ?? 0);
        }, 0) / monthCountDays;

      //Média do resultado bruto mensal de produto definido
      const grossProductDefinedSum =
        grossResultDefined.reduce((acc: any, item: any) => {
          return acc + (item.gas_station_gross_result_product ?? 0);
        }, 0) / monthCountDays;
      for (let i = 1; i <= day; i++) {
        grossDataArray[i - 1] =
          i < 10
            ? { data: `${monthDay}-0${i}`, gross_result: 0 }
            : {
              data: `${monthDay}-${i}`,
              gross_result: [],
              gross_result_defined: [],
              percentage: [],
            };
      }

      //Estrutura que separa entre o gráfico de galonagem e produto
      if (type === "fuel") {
        dataGross = await prismaRedeFlex.gallon_gross_history.findMany({
          select: {
            ibm_info_id: true,
            gallon_history_gross: true,
            gallon_history_date: true,
          },
          where: {
            gallon_history_date: {
              gte: `${monthDay}-01T00:00:00.000Z`,
              lte: `${actualDate}T23:59:59.999Z`,
            },
          },
        });
        grossDataArray.forEach((empty: any) => {
          const grossSum = dataGross.reduce((sum: number, element: any) => {
            const date = element.gallon_history_date
              .toISOString()
              .split("T")[0];
            if (date === empty.data) {
              return sum + (element.gallon_history_gross ?? 0);
            }
            return sum;
          }, 0);
          empty.gross_result = Math.round(grossSum * 100) / 100;
          empty.gross_result_defined =
            Math.round(grossLiterageDefinedSum * 100) / 100;
          empty.percentage = Math.round(
            (Math.round(grossSum * 100) /
              100 /
              (Math.round(grossLiterageDefinedSum * 100) / 100)) *
            100
          );
        });
      } else if (type === "product") {
        dataGross = await prismaRedeFlex.product_gross_history.findMany({
          select: {
            ibm_info_id: true,
            product_history_gross: true,
            product_history_date: true,
          },
          where: {
            product_history_date: {
              gte: `${monthDay}-01T00:00:00.000Z`,
              lte: `${actualDate}T23:59:59.999Z`,
            },
          },
        });
        grossDataArray.forEach((empty: any) => {
          const grossSum = dataGross.reduce((sum: number, element: any) => {
            const date = element.product_history_date
              .toISOString()
              .split("T")[0];
            if (date === empty.data) {
              return sum + (element.product_history_gross ?? 0);
            }
            return sum;
          }, 0);
          empty.gross_result = Math.round(grossSum * 100) / 100;
          empty.gross_result_defined =
            Math.round(grossProductDefinedSum * 100) / 100;
          empty.percentage = Math.round(
            (Math.round(grossSum * 100) /
              100 /
              (Math.round(grossProductDefinedSum * 100) / 100)) *
            100
          );
        });
      }

      return res.status(200).json({ data: grossDataArray });
    } catch (error) {
      return res
        .status(500)
        .json({ message: `Erro ao retornar os dados: ${error}` });
    }
  }
  //Fluxo para mapeamento por posto do resultado bruto galonagem e produto
  public async grossDailyChartStation(req: Request, res: Response) {
    try {
      const monthDay = moment().format("YYYY-MM-DD");
      const monthCountDays = moment().daysInMonth();
      const { use_token, type }: any = req.params;
      const secret = process.env.SECRET;
      if (!secret) {
        throw new Error(
          "Chave secreta não definida. Verifique a variável de ambiente SECRET."
        );
      }
      const id = extractUserIdFromToken(use_token, secret);
      let dataGross, dataGrossFormated;
      //Array com os dados definidos pelo usuario para resultado bruto galonagem/produto
      const grossResultDefined =
        await prismaRedeFlex.gas_station_setvariables.findMany({
          select: {
            gas_station_gross_result_literage: true,
            gas_station_gross_result_product: true,
            ibm_info_id: true,
          },
          where: { use_uuid: id },
        });
      //Estrutura que separa entre o gráfico de galonagem e produto
      if (type === "fuel") {
        dataGross = await prismaRedeFlex.gallon_gross_history.findMany({
          select: {
            gallon_history_gross: true,
            ibm_info_id: true,
            ibm_info: { select: { razaosocial: true } },
          },
          where: {
            gallon_history_date: `${monthDay}T00:00:00.000Z`,
          },
        });
        dataGrossFormated = dataGross.map((element) => {
          return {
            gallon_history_gross: element.gallon_history_gross,
            corporate_name: element.ibm_info?.razaosocial,
            gallon_history_gross_defined: 0,
            ibm_info_id: element.ibm_info_id,
            percentage: 0,
          };
        });
        dataGrossFormated?.forEach((element: any) => {
          const grossDefined = grossResultDefined.find(
            (definedValue) => element.ibm_info_id === definedValue.ibm_info_id
          );
          element.gallon_history_gross_defined =
            Math.round(
              (grossDefined?.gas_station_gross_result_literage ?? 0) * 100
            ) / 100;
          element.percentage = grossDefined?.gas_station_gross_result_literage
            ? Math.round(
              ((element.gallon_history_gross ?? 0) /
                (grossDefined.gas_station_gross_result_literage ?? 1)) *
              100 *
              100
            ) / 100
            : 0;
        });
      } else if (type === "product") {
        dataGross = await prismaRedeFlex.product_gross_history.findMany({
          select: {
            product_history_gross: true,
            ibm_info_id: true,
            ibm_info: { select: { razaosocial: true } },
          },
          where: {
            product_history_date: `${monthDay}T00:00:00.000Z`,
          },
        });
        dataGrossFormated = dataGross.map((element) => {
          return {
            product_history_gross: element.product_history_gross,
            corporate_name: element.ibm_info?.razaosocial,
            product_history_gross_defined: 0,
            ibm_info_id: element.ibm_info_id,
            percentage: 0,
          };
        });
        dataGrossFormated?.forEach((element: any) => {
          const grossDefined = grossResultDefined.find(
            (definedValue) => element.ibm_info_id === definedValue.ibm_info_id
          );
          element.product_history_gross_defined =
            Math.round(
              (grossDefined?.gas_station_gross_result_product ?? 0) * 100
            ) / 100;
          element.percentage = grossDefined?.gas_station_gross_result_product
            ? Math.round(
              ((element.product_history_gross ?? 0) /
                (grossDefined.gas_station_gross_result_product ?? 1)) *
              100 *
              100
            ) / 100
            : 0;
        });
      }

      return res.status(200).json({ data: dataGrossFormated });
    } catch (error) {
      return res
        .status(500)
        .json({ message: `Erro ao retornar os dados: ${error}` });
    }
  }
  public async deleteLastWeekDataPlusOne(req?: Request, res?: Response) {
    try {
      const oldDates = moment().tz("America/Sao_Paulo").subtract(8, 'days').format("YYYY-MM-DD");


      await prismaRedeFlex.gallon_gross_last_week.deleteMany({
        where: {
          gallon_last_history_date: {
            lt: `${oldDates}T00:00:00.000Z`,
          },
        }
      })
      await prismaRedeFlex.product_gross_last_week.deleteMany({
        where: {
          product_last_history_date: {
            lt: `${oldDates}T00:00:00.000Z`,
          },
        }
      })
      return res?.status(200).json({ message: "Dados deletados com sucesso!" });
    } catch (error) {
      return res
        ?.status(500)
        .json({ message: `Erro ao atualizar os dados: ${error}` });
    }
  }
  public async mltStorage(req?: Request, res?: Response) {
    try {

      const token = process.env.SAULOAPI;
      const tableData = await axios.get(
        `${process.env.NEXT_PUBLIC_DATAFRAME_EXTERN_API}/dataframes?token=${token}`
      );

      // const fuelArray = [
      //   "GASOLINA COMUM",
      //   "GAS NATURAL VEICULAR",
      //   "OLEO DIESEL B S10 COMUM",
      //   "ETANOL HIDRATADO COMBUSTIVEL",
      //   "OLEO DIESEL B S500 COMUM",
      //   "GASOLINA PREMIUM PODIUM",
      // ];

      const literagePerFuel = tableData.data["combustivel"]
      //   .map((element: any) => {
      //     if (
      //       element.hasOwnProperty("Combustivel") &&
      //       fuelArray.includes(element["Combustivel"])
      //     ) {
      //       return element;
      //     }
      //     return null;
      //   })
      //   .filter((value: object) => value !== null);

      // let arrayFuel: { [key: string]: number[] } = {};

      // literagePerFuel.forEach((element: any) => {
      //   if (!arrayFuel[element["Combustivel"]]) {
      //     arrayFuel[element["Combustivel"]] = [element["Lucro"]];
      //   } else {
      //     arrayFuel[element["Combustivel"]].push(element["Lucro"]);
      //   }
      // });
      // const fuelSums: { [key: string]: number } = {};

      // for (const fuelType in arrayFuel) {
      //   fuelSums[fuelType] = arrayFuel[fuelType].reduce(
      //     (sum, value) => Math.round((sum + value) * 100) / 100,
      //     0
      //   );
      // }

      // let arrayFuelVolume: { [key: string]: number[] } = {};

      // literagePerFuel.forEach((element: any) => {
      //   if (!arrayFuelVolume[element["Combustivel"]]) {
      //     arrayFuelVolume[element["Combustivel"]] = [element["Volume"]];
      //   } else {
      //     arrayFuelVolume[element["Combustivel"]].push(element["Volume"]);
      //   }
      // });
      // const fuelSumsVolume: { [key: string]: number } = {};

      // for (const fuelType in arrayFuelVolume) {
      //   fuelSumsVolume[fuelType] = arrayFuelVolume[fuelType].reduce(
      //     (sum, value) => Math.round((sum + value) * 100) / 100,
      //     0
      //   );
      // }
      // const mlt = Math.round(
      //   ((fuelSums["GASOLINA COMUM"] +
      //     fuelSums["GAS NATURAL VEICULAR"] +
      //     fuelSums["GASOLINA PREMIUM PODIUM"] +
      //     fuelSums["OLEO DIESEL B S10 COMUM"] +
      //     fuelSums["OLEO DIESEL B S500 COMUM"] +
      //     fuelSums["ETANOL HIDRATADO COMBUSTIVEL"]) /
      //     (fuelSumsVolume["GASOLINA COMUM"] +
      //       fuelSumsVolume["GAS NATURAL VEICULAR"] +
      //       fuelSumsVolume["GASOLINA PREMIUM PODIUM"] +
      //       fuelSumsVolume["OLEO DIESEL B S10 COMUM"] +
      //       fuelSumsVolume["OLEO DIESEL B S500 COMUM"] +
      //       fuelSumsVolume["ETANOL HIDRATADO COMBUSTIVEL"])) *
      //   100
      // ) / 100
      interface FuelEntry {
        Combustivel: string;
        "M/LT": number;
        "Nome da Empresa": string;
        "Hora da Venda": string;
      }
      const latestMLTByCompany: Record<string, FuelEntry> = {};

      literagePerFuel.forEach((entry: any) => {
        const company = entry["Nome da Empresa"];
        const timestamp = new Date(entry["Hora da Venda"]).getTime();

        if (!latestMLTByCompany[company] || timestamp > new Date(latestMLTByCompany[company]["Hora da Venda"]).getTime()) {
          latestMLTByCompany[company] = entry;
        }
      });

      let totalMLT = 0;
      let count = 0;

      Object.values(latestMLTByCompany).forEach((entry) => {
        totalMLT += entry["M/LT"];
        count += 1;
      });

      const averageMLT = count > 0 ? parseFloat((totalMLT / count).toFixed(2)) : 0
      const users = await prismaRedeFlex.users.findMany({
        select: { use_uuid: true },
      });
      const actualdate =
        moment().tz("America/Sao_Paulo").format("YYYY-MM-DDTHH:mm:ss") + "Z";

      await prismaRedeFlex.mlt_history.createMany({
        data: users.map((id) => ({
          mlt_history_value: averageMLT,
          mlt_history_date: actualdate,
          use_uuid: id.use_uuid,
        })),
      });
      return res
        ?.status(200)
        .json({ message: "Dados atualizados com sucesso!" });

    } catch (error) {
      return res
        ?.status(500)
        .json({ message: `Erro ao atualizar os dados: ${error}` });
    }

  }

  public async calcNetworkAnalysis(req: Request, res: Response) {
    try {
      const date = req.query.date?.toString();

      if (!date)
        return res
          .status(400)
          .json({ message: 'O campo date é obrigatório.' });

      const currentDate = DateTime.fromISO(date);

      const dates = [...Array(3).keys()].map((index: number) => currentDate.minus({ days: (index + 1) * 7 })).reverse();

      const dadosCombustivelMapped = await calcFuelByDates(dates, true);
      const dadosProdutosMapped = await calcProductByDates(dates, true);

      return res
        .status(200)
        .json({
          message: `Dados recuperados com sucesso.`,
          data: dates.map(date => {
            const dateString = date.toFormat('yyyy-MM-dd');
            return {
              date: dateString,
              qtdGalonagem: dadosCombustivelMapped[dateString] ?? 0,
              valorTotalProdutos: dadosProdutosMapped[dateString] ?? 0,
            }
          }),
        });
    } catch (error) {
      console.error('Erro ao buscar os dados: ', error);
      return res
        .status(500)
        .json({ message: `Não foi possível retornar os dados.` });
    }
  }

  public async calcCurrentNetworkAnalysis(req: Request, res: Response) {
    try {
      const date = req.query.date?.toString();

      if (!date)
        return res
          .status(400)
          .json({ message: 'O campo date é obrigatório.' });

      const currentDate = DateTime.fromISO(date);

      const dates = [...Array(4).keys()].map((index: number) => currentDate.minus({ days: (index) * 7 })).reverse();

      const dadosCombustivelMapped = await calcFuelByDates(dates, false);
      const dadosProdutosMapped = await calcProductByDates(dates, false);

      return res
        .status(200)
        .json({
          message: `Dados recuperados com sucesso.`,
          data: dates.map(date => {
            const dateString = date.toFormat('yyyy-MM-dd');
            return {
              date: dateString,
              qtdGalonagem: dadosCombustivelMapped[dateString] ?? 0,
              valorTotalProdutos: dadosProdutosMapped[dateString] ?? 0,
            }
          }),
        });
    } catch (error) {
      console.error('Erro ao buscar os dados: ', error);
      return res
        .status(500)
        .json({ message: `Não foi possível retornar os dados.` });
    }
  }

  public async calcMonthlyProjection(req: Request, res: Response) {
    try {
      const date = req.query.date?.toString();

      if (!date)
        return res
          .status(400)
          .json({ message: 'O campo date é obrigatório.' });

      const currentDate = DateTime.fromISO(date);

      const dates = [...Array(currentDate.day).keys()].map((index: number) => currentDate.minus({ days: index })).reverse();

      const dadosCombustivelMapped = await calcFuelByDates(dates, true);
      const dadosProdutosMapped = await calcProductByDates(dates, true);

      return res
        .status(200)
        .json({
          message: `Dados recuperados com sucesso.`,
          data: dates.map(date => {
            const dateString = date.toFormat('yyyy-MM-dd');
            return {
              date: dateString,
              qtdGalonagem: dadosCombustivelMapped[dateString] ?? 0,
              valorTotalProdutos: dadosProdutosMapped[dateString] ?? 0,
            }
          }),
        });
    } catch (error) {
      console.error('Erro ao buscar os dados: ', error);
      return res
        .status(500)
        .json({ message: `Não foi possível retornar os dados.` });
    }
  }

  public async calcCurrentMonthlyProjection(req: Request, res: Response) {
    try {
      const date = req.query.date?.toString();

      if (!date)
        return res
          .status(400)
          .json({ message: 'O campo date é obrigatório.' });

      const currentDate = DateTime.fromISO(date);

      const dates = [...Array(currentDate.day).keys()].map((index: number) => currentDate.minus({ days: index })).reverse();

      const dadosCombustivelMapped = await calcFuelByDates(dates, false);
      const dadosProdutosMapped = await calcProductByDates(dates, false);

      return res
        .status(200)
        .json({
          message: `Dados recuperados com sucesso.`,
          data: dates.map(date => {
            const dateString = date.toFormat('yyyy-MM-dd');
            return {
              date: dateString,
              qtdGalonagem: dadosCombustivelMapped[dateString] ?? 0,
              valorTotalProdutos: dadosProdutosMapped[dateString] ?? 0,
            }
          }),
        });
    } catch (error) {
      console.error('Erro ao buscar os dados: ', error);
      return res
        .status(500)
        .json({ message: `Não foi possível retornar os dados.` });
    }
  }

  //Executará a tarefa de 8 em 8 dias
  public deleteData() {
    cron.schedule(
      "0 0 */8 * *",
      async () => {
        try {
          await this.deleteLastWeekDataPlusOne();
        } catch (error) {
          console.error("Erro durante a verificação de alertas:", error);
        }
      },
      {
        timezone: "America/Sao_Paulo",
      }
    );
  }
  public scheduleMonthlyBigNumberUpdate() {
    cron.schedule(
      "0 7 * * *",
      async () => {
        try {
          await this.BigNumbersMonth();
        } catch (error) {
          console.error("Erro durante a verificação de alertas:", error);
        }
      },
      {
        timezone: "America/Sao_Paulo",
      }
    );
  }
  public scheduledailyProductProfitUpdate() {
    cron.schedule("*/2 * * * *", async () => {
      try {
        await this.profitProductSum();
      } catch (error) {
        console.error("Erro durante a verificação de alertas:", error);
      }
    });
  }
  public scheduledailyMltStorage() {
    cron.schedule(
      "0 18 * * *",
      async () => {
        try {
          await this.mltStorage();
        } catch (error) {
          console.error("Erro durante a verificação de alertas:", error);
        }
      },
      {
        timezone: "America/Sao_Paulo",
      }
    );
  }
  public scheduledailyGrossProductLiterage() {
    cron.schedule(
      "*/5 * * * *",
      async () => {
        try {
          await this.grossHistory();
        } catch (error) {
          console.error("Erro durante a verificação:", error);
        }
      },
      {
        timezone: "America/Sao_Paulo",
      }
    );
  }
}
const dataController = new DataController();
dataController.scheduleMonthlyBigNumberUpdate();
dataController.scheduledailyMltStorage()
dataController.scheduledailyProductProfitUpdate();
dataController.scheduledailyGrossProductLiterage();
dataController.deleteData()
export default new DataController();

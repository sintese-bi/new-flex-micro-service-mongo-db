import DataController from "../src/Controllers/DataController";
import { Router } from "express"

const dataRouter = Router()

dataRouter.get("/infodata", DataController.infoData)
dataRouter.get("/sum-fuel-literage/:use_token", DataController.sumFuelLiterage)
dataRouter.post("/daily-graphic", DataController.dailyGraphic)
dataRouter.post("/daily-graphic-fuel", DataController.dailyGraphicFuel)
dataRouter.post("/daily-graphic-product", DataController.dailyGraphicProduct)
dataRouter.post("/regional-chart", DataController.regionalChart)
dataRouter.post("/regional-chart-fuel", DataController.regionalChartFuel)
dataRouter.post("/regional-chart-product", DataController.regionalChartProduct)
dataRouter.post("/regional-graph/:filter", DataController.regionalStateDataFrame)
dataRouter.post("/daily-graph/:filter", DataController.regionalStateDailyDataFrame)
// dataRouter.post("/regional-station-daily-fuel-product", DataController.regionalStateDataFrameProduct)
dataRouter.get("/map-data/:use_token", DataController.mapData)
dataRouter.get("/teste", DataController.BigNumbersMonth)
dataRouter.get("/fuel-types", DataController.fuelTypes)
dataRouter.get("/gross-history", DataController.grossHistory)
dataRouter.get("/gross-daily/:use_token/:type", DataController.grossDailyChart)
dataRouter.get("/gross-daily-per-station/:use_token/:type", DataController.grossDailyChartStation)
dataRouter.get("/bignumbers-mlt/:use_token", DataController.bigNumbersMLT)
dataRouter.get("/testes", DataController.mltStorage)
dataRouter.get("/calc-network-analysis/:use_token", DataController.calcNetworkAnalysis)
dataRouter.get("/calc-current-network-analysis/:use_token", DataController.calcCurrentNetworkAnalysis)
dataRouter.get("/calc-monthly-projection/:use_token", DataController.calcMonthlyProjection)
dataRouter.get("/calc-current-monthly-projection/:use_token", DataController.calcCurrentMonthlyProjection)



// dataRouter.get("/tests",DataController.tests)
export default dataRouter




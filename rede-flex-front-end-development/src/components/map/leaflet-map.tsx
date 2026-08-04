"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import L, { PointExpression } from "leaflet";
import MapPopup from "./popup";
export type IMyMap = {
  lat: number;
  long: number;
  nomefantasia: string;
  ibm: string;
  endereco: string;
  "M/LT": number;
  "M/LT_Definido": number;
  TMC: number;
  TMC_Definido: number;
  "TM VOL": number;
  "TM VOL_Definido": number;
  TMP: number;
  TMP_Definido: number;
  TMF: number;
  TMF_Definido: number;
  LBO: number;
  LBOProduto: number;
  LBOGalonagem: number;
  LBO_Definido: number;
  LBO_Produto_Definido: number;
  LBO_Galonagem_Definido: number;
  averageComparison: 0 | 1 | 2 | 3;
};
const icon_options = {
  iconSize: [38, 35] as PointExpression,
  shadowSize: [50, 64] as PointExpression,
  iconAnchor: [22, 94] as PointExpression,
  shadowAnchor: [4, 62] as PointExpression,
  popupAnchor: [-3, -76] as PointExpression,
};
export default function Leaflet({ data }: { data: IMyMap[] }) {
  var greenIcon = L.icon({
    ...icon_options,
    iconUrl: "/icons/green_fuel_icon.png",
  });
  var redIcon = L.icon({
    ...icon_options,
    iconUrl: "/icons/red_fuel_icon.png",
  });
  var yellowIcon = L.icon({
    ...icon_options,
    iconUrl: "/icons/yellow_fuel_icon.png",
  });
  var blueIcon = L.icon({
    ...icon_options,
    iconUrl: "/icons/blue_fuel_icon.png",
  });
  const icons = {
    0: greenIcon,
    1: yellowIcon,
    2: redIcon,
    3: blueIcon,
  };

  return (
    <MapContainer
      center={[-19.912998, -43.940933]}
      zoom={13}
      scrollWheelZoom={false}
      className="h-full w-full rounded-lg z-10 relative"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {data.map((item, index) => {
        return (
          <Marker
            position={[item["lat"], item["long"]]}
            icon={icons[item["averageComparison"] || 0]}
            key={index}
          >
            <Popup>
              <MapPopup item={item} />
            </Popup>
          </Marker>
        );
      })}
      <div className="absolute bottom-2 left-2 bg-white shadow-xl p-2 rounded-md text-sm z-[1000]">
        <div className="">
          <div className="flex items-center gap-2 px-2">
            <div className="h-4 w-11 rounded-sm bg-green-100 border-gray-400 border-[1px]"></div>
            <p className="text-sm">
              Lucro bruto operacional, TMs, M/LT acima do definido
            </p>
          </div>
          <div className="flex items-center gap-2 px-2">
            <div className="h-4 w-11 rounded-sm bg-yellow-100 border-gray-400 border-[1px]"></div>
            <p className="text-sm">Lucro bruto operacional acima do definido</p>
          </div>
          <div className="flex items-center gap-2 px-2">
            <div className="h-4 w-11 rounded-sm bg-red-100 border-gray-400 border-[1px]"></div>
            <p className="text-sm">
              Lucro bruto operacional abaixo do definido
            </p>
          </div>
          <div className="flex items-center gap-2 px-2">
            <div className="h-4 w-11 rounded-sm bg-blue-100 border-gray-400 border-[1px]"></div>
            <p className="text-sm">Postos com possível falha no sistema</p>
          </div>
        </div>
      </div>
    </MapContainer>
  );
}
